const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  id: 'realtimereport'
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    // Define Variables

  }

  execute() {
    console.log('Discord - RealTime Report (Disabled)');
  }

  cleanup() {

  }
}

class WaifuGuild {
  constructor(guildId, discordGuild = {}) {
    this.id = guildId;
    this.type = 'discord';

    this.welcome = {
      active: discordGuild.welcome ? discordGuild.welcome.M.active.BOOL : false,
      message: discordGuild.welcome ? discordGuild.welcome.M.message.S : '&newUser, Welcome to &serverName!'
    }
  }

  attributify() {
    return {
      id: {S: this.id},
      type: {S: this.type},
      welcome: {M: {
        active: {BOOL: this.welcome.active},
        message: {S: this.welcome.message}
      }}
    }
  }
}
