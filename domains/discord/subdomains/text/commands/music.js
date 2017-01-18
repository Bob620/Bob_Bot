const Command = require('./command.js');
const ytdl = require('ytdl-core');

const options = {
    "keyword": "music",
    "commands": ["current", "add", "playlist", "stop", "join", "leave"], // play, pause, skip
    "requires": []
}

const musicConn = {};

class Music extends Command {
    constructor(commands) {
        super(commands, options);
    }

    execute(message, garnerInfo) {
        const content = message.content.toLowerCase().split(' ');
        switch(content[1]) {
            case "current":
                this.current(message);
                break;
            case "add":
                if (content[2]) {
                    this.add(message, content[2]);
                }
                break;
            case "playlist":
                this.playlist(message);
                break;
            case "stop":
                this.stop(message);
                break;
            case "join":
                const channelName = content[2];
                if (channelName) {
                    const channel = message.guild.channels.find((channel) => {
                        if (channel.name.toLowerCase() === channelName && channel.type === "voice") {
                            return true;
                        }
                        return false;
                    });
                    if (channel) {
                        this.join(message, channel, garnerInfo);
                    }
                }
                break;
            case "leave":
                this.leave(message);
                break;
            case "play":
                this.play();
                break;
            case "pause":
                this.pause();
                break;
            case "skip":
                this.skip();
                break;
        }
    }

    help(command) {

    }

    current(message) {
        const voiceChannel = musicConn[message.guild.id];
        if (voiceChannel) {
            const currentSong = voiceChannel.songList.array[0];
            message.channel.sendMessage(currentSong.title);
        }
    }

    add(message, url) {
        const voiceChannel = musicConn[message.guild.id];
        if (voiceChannel) {
            const song = new Song(url)
            song.populate()
            .then((info) => {
                console.log(info);
                const playlist = voiceChannel.songList;
                playlist.add(song);
                message.channel.sendMessage(song.title+" was added to the playlist.");

                if (playlist.array.length == 1) {
                    voiceChannel.next(message);
                }
            })
            .catch((err) => {
                console.log(err);
                message.channel.sendMessage("I couldn't find that song :/");
            });
        }
    }

    playlist(message) {
        const voiceChannel = musicConn[message.guild.id];
        if (voiceChannel) {
            const playlist = voiceChannel.songList;
            message.channel.sendMessage(playlist.getAll('title').join('\n'));
        }
    }

    stop(message) {
        const voiceChannel = musicConn[message.guild.id];
        if (voiceChannel) {
            voiceChannel.stop();
            message.channel.sendMessage("Stopping Playback");
        }
    }

    join(message, channel, garnerInfo) {
        this.leave(message);
        musicConn[message.guild.id] = new Connection(channel, garnerInfo.music.playlist);
        musicConn[message.guild.id].connect()
        .then((test) => {
            message.channel.sendMessage("I have joined the voice channel.");
        })
        .catch((test) => {
            message.channel.sendMessage("I wasn't able to join.");
        })
    }

    leave(message) {
        const voiceChannel = musicConn[message.guild.id];
        if (voiceChannel) {
            voiceChannel.close();
            delete musicConn[message.guild.id];
        }
        if (message.guild.voiceConnection) {
            message.guild.voiceConnection.disconnect();
        }
    }

    pause() {

    }

    play() {

    }

    skip() {

    }
}

class Connection {
    constructor(voiceChannel, songList) {
        this.voiceChannel = voiceChannel;
        this.songList = songList;
        this.status = false;
        this.stream = undefined;
    }

    set ready(status) {
        this.status = status;
    }

    get ready() {
        return this.status;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.voiceChannel.join()
            .then((connection) => {
                this.ready = true;
                resolve(true);
            })
            .catch((err) => {
                console.log(err);
                reject(false);
            });
        });
    }

    close() {
        if (this.voiceChannel.connection) {
            this.voiceChannel.leave();
        }
    }

    stop() {
        if (this.stream) {
            this.stream.end();
            this.stream = undefined;
        }
    }

    next(message, wasPrev) {
        console.log(this.songList);
        if (this.ready) {
            this.stop();

            if (wasPrev) {
                this.songList.delete("url", this.songList.array[0].url);
            }

            if (this.songList.array.length > 0) {
                message.channel.sendMessage("Starting "+this.songList.array[0].title);

                const stream = ytdl(this.songList.array[0].url, {filter : 'audioonly'});
                this.stream = this.voiceChannel.connection.playStream(stream)//{"volume": 0.5+(this.loudness/100)})
                .on("end", (reason) => {
                    message.channel.sendMessage("Ending song.");
                    this.stop();
                    this.next(message, true);
                });
            }
        }
    }

    empty() {
        this.songList.empty();
    }
}

class Song {
    constructor(url) {
        this.length = 0;
        this.url = url;
        this.title = "";
        this.author = "";
        this.loudness = 0;
        this.thumbnail = "";
    }

    populate() {
        return new Promise((resolve, reject) => {
            ytdl.getInfo(this.url, function(err, info) {
                console.log(info);
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        })
        .then((info) => {
            this.loudness = info.loudness;
            this.thumbnail = info.thumbnail_url;
            this.length = info.length_seconds;
            this.title = info.title;
            this.author = info.author;

            return info;
        })
        .catch((err) => {
            return err;
        });
    }
}

module.exports = Music;