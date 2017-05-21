const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "status"
}

const delay = 15000;

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
    this.interval = null;
    this.currentStatus = 0;
    this.statistics = this.domain.backgroundTasks.get('statistics');
    this.rotation = [
      () => {
        return {
          "status": "online",
          "game": {
            "name": this.statistics.totalOnlineMembers+" people online"
          }
        }
      },
      () => {
        return {
          "status": "online",
          "game": {
            "name": "2.0.0 bby"
          }
        }
      },
      () => {
        return {
          "status": "online",
          "game": {
            "name": "Markchi baka baka~~"
          }
        }
      }
    ];
  }

  execute() {
    console.log('Discord - Status');
    const user = this.domain.server.connection.user;

    user.setPresence(this.rotation[this.currentStatus]()).then(() => {}).catch((err) => {throw err});

    this.interval = setInterval(() => {
      this.currentStatus++;
      if (this.currentStatus >= this.rotation.length) {
        this.currentStatus = 0;
      }

      user.setPresence(this.rotation[this.currentStatus]()).then(() => {}).catch((err) => {throw err});
    }, delay);
  }

  cleanup() {
    this.domain.server.connection.user.setStatus("idle").then(() => {}).catch(() => {});

    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}
