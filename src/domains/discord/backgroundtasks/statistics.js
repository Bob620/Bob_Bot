const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "statistics"
}

const delay = 60000;

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    // Define Variables
    this.guilds = [];
    this.totalOnlineMembers = 0;
    this.interval = null;
  }

  execute() {
    console.log('Discord - Statistics');
    const guilds = this.domain.server.connection.guilds;

    // Clear Variables
    this.guilds = [];
    this.totalOnlineMembers = 0;

    // Set Variables
    guilds.forEach((guild) => {
      this.guilds.push(guild.id);

      guild.presences.forEach((presence) => {
        if (presence.status !== "offline") {
          this.totalOnlineMembers++;
        }
      });
    });

    // Set Interval for Further Updates
    this.interval = setInterval(() => {
      this.guilds = [];
      this.totalOnlineMembers = 0;

      guilds.forEach((guild) => {
        this.guilds.push(guild.id);

        guild.presences.forEach((presence) => {
          if (presence.status !== "offline") {
            this.totalOnlineMembers++;
          }
        });
      });
    }, delay);

    // WebExtention
    const statistics = this;

    // Define Statistics based API
/*
    this.domain.modules.webserver.addGet('/api/stats', (req, res, next) => {
      res.json({
        totalGuilds: statistics.guilds.length,
        totalOnlineMembers: statistics.totalOnlineMembers
      });
    });

    this.domain.modules.webserver.addGet('/api/guilds', (req, res, next) => {
      res.json(statistics.guilds);
    });
*/
  }

  cleanup() {
    // Remove Interval
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}
