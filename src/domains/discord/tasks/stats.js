const Task = require('./../../../util/task.js');

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
    const statistics = this.domain.backgroundTasks.get('statistics');

    channel.send(`I'm currenting in ${statistics.guilds.length} guilds.\nThere are currently ${statistics.totalOnlineMembers} people online.`)
    .then(() => {}).catch(() => {});
  }

  help(text) {

  }
}
