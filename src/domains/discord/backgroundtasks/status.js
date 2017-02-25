const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "status"
}

const delay = 16000;

class Status extends Task {
  constructor(domain) {
    super(domain, options);
    this.interval = null;
    this.currentStatus = 0;
    this.rotation = [
      {
        "status": "online",
        "game": {
          "name": "People are online"
        }
      },
      {
        "status": "online",
        "game": {
          "name": "2.0.0 bby"
        }
      },
      {
        "status": "online",
        "game": {
          "name": "Markchi baka baka~~"
        }
      }
    ];
  }

  execute() {
/*    const user = this.domain.server.connection.user;

    user.setPresence(this.rotation[this.currentStatus]).then(() => {}).catch((err) => {throw err});

    this.interval = setInterval(() => {
      if (this.currentStatus < this.rotation.length) {
        this.currentStatus++;
      } else {
        this.currentStatus = 0;
      }

      user.setPresence(this.rotation[this.currentStatus]).then(() => {}).catch((err) => {throw err});
    }, delay);*/
  }

  cleanup() {
    this.domain.server.connection.user.setStatus("idle").then(() => {}).catch(() => {});

    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}

module.exports = Status;
