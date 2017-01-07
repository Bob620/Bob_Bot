//const ytdl = require('ytdl-core');
//const musicProcess = require('./MusicProcess.js');

module.exports = class {
    constructor() {
    }
    static current(server, message) {
        const music = server.music;
        const currentSong = music.currentSong;

        if (currentSong !== undefined) {
            message.channel.sendEmbed({
                "title": currentSong.author,
                "author": currentSong.title
            })
            .then(() => {

            })
            .catch(() => {

            });
        } else {
            message.channel.sendMessage("There is no song currently playing.")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    static add(server, message, link) {

    }
    static skip(server, message) {

    }
    static playlist(server, message) {

    }
    static pause(server, message) {

    }
    static stop(server, message) {

    }
    static join(server, message) {
/*        const music = server.music;
        const voiceChannel = message.member.voiceChannel;

        if(voiceChannel) {
            if (music.channelName === undefined) {
                message.guild.voiceConnection.disconnect();
                music.channelName = undefined;
            }
            voiceChannel.join(voiceChannel)
            .then(() => {
                message.channel.sendMessage("I have successfully joined the voice channel.")
                .then(() => {
                    music.channelName = voiceChannel.name;
                })
                .catch(() => {

                });
            })
            .catch(() => {
                message.channel.sendMessage("I was unable to join the voice channel")
                .then(() => {

                })
                .catch(() => {

                });
            });
        } else {
            message.channel.sendMessage("I was unable to join the voice channel")
            .then(() => {

            })
            .catch(() => {

            });
        }
*/    }
    static leave(server, message) {
//        if (music.channelName !== undefined) {
//            message.guild.voiceConnection.disconnect();
//            music.channelName = undefined;
//        }
    }
    static basicHelp(server, message) {
        const prefix = server.prefix;
//        message.channel.sendMessage("Use \""+prefix+"music add [URL]\" to add a youtube video to the playlist.\n\""+prefix+"music playlist\" to view the current playlist\n\""+prefix+"help music\" for more information.")
        message.channel.sendMessage("Music commands are currently under development.")
        .then(() => {

        })
        .catch(() => {
            console.log("Error sending message");
        });
    }
    static help(server, message) {
        const prefix = server.prefix;
        message.member.sendEmbed({
            "author": {
                "name": message.guild.name,
                "url": "https://discordapp.com/channels/"+message.guild.id
            },
            "thumbnail": {
                "url": message.guild.iconURL,
                "height": 400,
                "width": 400
            },
/*            "fields": [
                {
                    "name": prefix+"music current",
                    "value": "Displays the current playing song"
                },
                {
                    "name": prefix+"music add [link]",
                    "value": "Adds a new Youtube song to the playlist\nMaximum video length of 10 minutes"
                },
                {
                    "name": prefix+"music playlist",
                    "value": "Displays the playlist\nSends a PM"
                },
                {
                    "name": prefix+"music skip",
                    "value": "Skips the current song if the majority in the music voice channel use it"
                },
                {
                    "name": prefix+"music pause",
                    "value": "Pauses the music if the majority in the music voice channel use it on the same song"
                },
                {
                    "name": prefix+"music stop",
                    "value": "Required Permissions: Mods+\nStops the current song and clears the playlist"
                },
                {
                    "name": prefix+"music join [voice channel name]",
                    "value": "Required Permissions: Mods+\nJoins the [voice channel name]\nCurrently does not auto-reconnect if bot restarts"
                },
                {
                    "name": prefix+"music leave",
                    "value": "Required Permissions: Mods+\nLeaves the current voice channel"
                }
            ],
*/
            "fields": [
                {
                    "name": "Music is currently under development",
                    "value": "Sorry for any inconveniences this might have caused"
                }
            ],
            "color": "353535",
            "description": "----------------------",
            "title": "Music Help"
        })
        .then(() => {
            message.channel.sendMessage("<@"+message.author.id+"> , I've sent you a PM with more info.")
            .then(() => {

            })
            .catch(() => {

            });
        })
        .catch((err) => {
            console.log("Error sending message");
            console.log(err);
        });
    }
}