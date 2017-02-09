const ytdl = require('ytdl-core');

class VoiceConnection {
  constructor(id, channel, connection) {
    /**
     * The discord voice connection
     * @type {voiceConnection}
     * @readonly
     */
    Object.defineProperty(this, "connection", {
      value: connection
    });

    /**
     * The discord channel
     * @type {voiceConnection}
     * @readonly
     */
    Object.defineProperty(this, "channel", {
      value: channel
    });

    /**
     * The discord guild id
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "id", {
      value: id
    });

    this.connection.on("disconnect", () => {
      this.connected = false;
    });

    this.connection.on("error", () => {
      this.connected = false;
    });

    this.currentPlayback = false;
    this.connected = true;
    this.playlist = [];
    this.current = false;
    this.refresh();
  }

  refresh() {
    if (this.connected) {
      this.activityLevel = 30;
    }
  }

  add(url) {
    this.refresh();
    return new Promise((resolve, reject) => {
      ytdl.getInfo(url, (err, info) => {
        this.refresh();
        if (err) {
          console.trace(err);
          reject("Unable to find that song.");
        } else {
          const song = new Song(url, info);
          this.playlist.push(song);
          if (!this.current) {
            this.play();
          }
          resolve(song);
        }
      });
    });
  }

  stop() {
    this.refresh();
    this.playlist = [];
    if (this.current) {
      this.currentPlayback.end();
      this.currentPlayback = false;
      this.current = false;
    }
    return true;
  }

  skip() {
    this.refresh();
    this.currentPlayback.end();
    return this.play();
  }

  pause() {
    this.refresh();
    if (this.currentPlayback) {
      this.currentPlayback.pause();
      return true;
    }
    return false;
  }

  play() {
    this.refresh();
    if (this.currentPlayback) {
      this.currentPlayback.resume();
      return this.current;
    } else if (this.playlist[0]) {
      this.current = this.playlist.shift();
      this.channel.sendMessage(`now playing ${this.current.title}`)
      .then(() => {})
      .catch((err) => {console.log(err)});
      this.currentPlayback = this.connection.playStream(ytdl(this.current.url, {filter : 'audioonly'}), {"volume": 0.6+(this.current.loudness/100)})
      .on("end", () => {
        this.channel.sendMessage("Ending Playback")
        .then(() => {})
        .catch((err) => {console.log(err)});
        this.currentPlayback = false;
        this.current = false;
        this.play();
      });
      return this.current;
    }
    return {};
  }

  leave() {
    this.connection.disconnect();
  }
}

class Song {
  constructor(url, info) {
    this.url = url;
    this.loudness = info.loudness;
    this.thumbnail = info.thumbnail_url;
    this.length = info.length_seconds;
    this.title = info.title;
    this.author = info.author;
  }
}

module.exports = VoiceConnection;
