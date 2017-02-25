const Task = require('./src/util/task.js');

const options = {
  "id": "statistics"
}

const delay = 60000;

class Statistics extends Task {
  constructor(domain) {
    super(domain, options);

    this.totalGuilds = 0;
    this.totalOnlineMembers = 0;
    this.interval = null;

    this.guilds = this.domain.server.guilds;
  }

  execute() {
    this.guilds.forEach((guild) => {
      guild.presences.forEach((presence) => {
        if (presence.status !== "offline") {
          this.totalOnlineMembers++;
        }
      });
    });

    this.interval = setInterval(() => {
      this.guilds.forEach((guild) => {
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
