const Task = require('./../../../util/task.js');

const options = {
  "id": "stats",
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    const statistics = this.domain.backgroundTasks.get('statistics');

    this.domain.modules.webserver.addGet('/api/stats', (req, res, next) => {
      res.json({
        totalGuilds: statistics.guilds.length,
        totalOnlineMembers: statistics.totalOnlineMembers
      });
    });

    this.domain.modules.webserver.addGet('/api/guilds', (req, res, next) => {
      res.json(statistics.guilds);
    });
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
