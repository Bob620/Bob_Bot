const Task = require('./../../../util/task.js');

const options = {
  id: 'stats',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  async execute(message) {
    const channel = message.channel;
    const statistics = this.domain.backgroundTasks.get('statistics');

    await channel.send(`I'm currenting in ${statistics.guilds.size} guilds.\nThere are currently ${statistics.totalOnlineMembers} people online.`);
  }
}
