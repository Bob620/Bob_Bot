const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "statistics"
}

const delay = 60000;

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    this.guilds = [];
    this.totalOnlineMembers = 0;
    this.interval = null;
  }

  execute() {
    console.log('Discord - Statistics');
    const guilds = this.domain.server.connection.guilds;

    this.guilds = [];
    this.totalOnlineMembers = 0;

    guilds.forEach((guild) => {
      this.guilds.push({
        id: guild.id,
        name: guild.name,
        icon: guild.icon
      });

      guild.presences.forEach((presence) => {
        if (presence.status !== "offline") {
          this.totalOnlineMembers++;
        }
      });
    });

    this.interval = setInterval(() => {
      this.guilds = [];
      this.totalOnlineMembers = 0;

      guilds.forEach((guild) => {
        this.guilds.push({
          id: guild.id,
          name: guild.name,
          icon: guild.icon
        });

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
