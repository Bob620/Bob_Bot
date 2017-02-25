const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "statistics"
}

const delay = 6000;

class Statistics extends Task {
  constructor(domain) {
    super(domain, options);

    this.totalGuilds = 0;
    this.totalOnlineMembers = 0;
    this.interval = null;
  }

  execute() {
    const guilds = this.domain.server.connection.guilds;

    this.totalGuilds = guilds.length;

    guilds.forEach((guild) => {
      guild.presences.forEach((presence) => {
        if (presence.status !== "offline") {
          this.totalOnlineMembers++;
        }
      });
    });

    this.interval = setInterval(() => {
      this.totalGuilds = guilds.length;
      
      guilds.forEach((guild) => {
        guild.presences.forEach((presence) => {
          if (presence.status !== "offline") {
            this.totalOnlineMembers++;
          }
        });
      });
    }, delay);
  }

  cleanup() {
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}

module.exports = Statistics;
