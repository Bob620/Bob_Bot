const Task = require('./../../../util/task.js');
const fs = require('fs');

const options = {
  "id": "stats",
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  supports(message) {
    const content = message.content.toLowerCase().split(" ");

    if (content[0] === `!${this.id}`) {
      return true;
    }
    return false;
  }

  execute(message) {
    const channel = message.channel;

    channel.send(`I'm currenting in ${this.domain.backgroundTasks.get('statistics').totalGuilds} guilds.\nThere are currently ${this.domain.backgroundTasks.get('statistics').totalOnlineMembers} people online.`)
    .then(() => {}).catch(() => {});
  }

  help(text) {

  }
}
