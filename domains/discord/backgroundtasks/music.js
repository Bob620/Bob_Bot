const BackgroundTask = require('./backgroundtask.js');
const VoiceConnection = require('./../util/voiceconnection.js');

const options = {
  "keyword": "music"
}

class Music extends BackgroundTask {
  constructor(domainInfo) {
    super(domainInfo, options);
    this.voiceConnections = new Map();

    setInterval(() => {
      this.voiceConnections.forEach((voiceConnection) => {
        if (!voiceConnection.active || !voiceConnection.connected || voiceConnection.activityLevel <= 0) {
          voiceConnection.leave();
          this.voiceConnections.delete(voiceConnection.id);
        }
        voiceConnection.activityLevel--;
      })
    }, 60000);

  }

  /**
   * Returns the current song
   * @param {Guild} guild The guild to get context from
   * @returns {Song|false}
   */
  current(guild) {
    if (this.voiceConnections.has(guild.id)) {
      return this.voiceConnections.get(guild.id).current;
    }
    return false;
  }

  /**
   * Returns the song playlist
   * @param {Guild} guild The guild to get context from
   * @returns {Array}
   */
  playlist(guild) {
    if (this.voiceConnections.has(guild.id)) {
      return this.voiceConnections.get(guild.id).playlist;
    }
    return [];
  }

  /**
   * Adds a song to the playlist then returns the song metadata
   * @param {Guild} guild The guild to get context from
   * @param {string} url The url to get a song from
   * @returns {Promise<Song>|Promise<string>}
   */
  add(guild, url) {
    if (this.voiceConnections.has(guild.id)) {
      return this.voiceConnections.get(guild.id).add(url);
    }
    return Promise.reject("Not currently connected to a channel.");
  }

  /**
   * Empties the current playlist
   * @param {Guild} guild The guild to get context from
   * @returns {boolean}
   */
  stop(guild) {
    if (this.voiceConnections.has(guild.id)) {
      return this.voiceConnections.get(guild.id).stop();
    }
    return false;
  }

  /**
   * Continues or starts playback of the current song
   * @param {Guild} guild The guild to get context from
   * @returns {boolean}
   */
  play(guild) {
    if (this.voiceConnections.has(guild.id)) {
      return this.voiceConnections.get(guild.id).play();
    }
    return false;
  }

  /**
   * Pauses playback fo the current song
   * @param {Guild} guild The guild to get context from
   * @returns {boolean}
   */
  pause(guild) {
    if (this.voiceConnections.has(guild.id)) {
      return this.voiceConnections.get(guild.id).pause();
    }
    return true;
  }

  /**
   * Skips the current song and returns the next song's metadata
   * @param {Guild} guild The guild to get context from
   * @returns {Song|false}
   */
  skip(guild) {
    if (this.voiceConnections.has(guild.id)) {
      return this.voiceConnections.get(guild.id).skip();
    }
    return false;
  }

  /**
   * Joins the specified voice chat
   * @param {Guild} guild The guild to get context from
   * @returns {Promise<Object>}
   */
  join(guild, channel, voiceChatName) {
    return new Promise((resolve, reject) => {
      if (this.voiceConnections.has(guild.id)) {
        this.voiceConnections.get(guild.id).leave();
      }
      const voiceChat = guild.channels.find((channel) => {
        if (channel.name.toLowerCase() === voiceChatName && channel.type === "voice") {
        return true;
        }
      });
      if (voiceChat) {
        voiceChat.join()
        .then((connection) => {
          resolve(this.voiceConnections.set(guild.id, new VoiceConnection(guild.id, channel, connection)));
        })
        .catch((err) => {
          console.trace(err);
          reject({"error": "An error occured while connecting, please try again later."});
        });
      }
    });
  }

  /**
   * Leave the current voice chat and clears the playlist
   * @param {string} guild The guild to get context from
   * @returns {boolean}
   */
  leave(guild) {
    if (this.voiceConnections.has(guild.id)) {
      this.voiceConnections.get(guild.id).leave();
      this.voiceConnections.delete(guild.id);
      return true;
    }
    return false;
  }

  start() {

  }
}

module.exports = Music;
