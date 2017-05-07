const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "statistics"
}

const delay = 60000;

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    this.totalGuilds = 0;
    this.totalOnlineMembers = 0;
    this.interval = null;
  }

  execute() {
    console.log('test - Statistics');
    const guilds = this.domain.server.connection.guilds;

    this.totalGuilds = guilds.size;
    this.totalOnlineMembers = 0;

    guilds.forEach((guild) => {
      guild.presences.forEach((presence) => {
        if (presence.status !== "offline") {
          this.totalOnlineMembers++;
        }
      });
    });

    this.interval = setInterval(() => {
      this.totalGuilds = guilds.size;
      this.totalOnlineMembers = 0;

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
