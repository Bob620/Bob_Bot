const Task = require('./src/util/task.js');

const options = {
  "id": "status"
}

const delay = 16000;
const rotation = [
  {
    {
      "status": "online",
      "game": {
        "name": "Hello :3"
      }
    }
  }
];

class Status extends Task {
  constructor(domain) {
    super(domain, options);
    this.interval = null;
    this.currentStatus = 0;
    this.rotation = [
      () => {
        return {
          "status": "online",
          "game": {
            "name": this.domain.backgroundTasks.get("statistics").totalOnlineMembers;
          }
        }
      }
    ];

    this.user = this.domain.server.user;
  }

  execute() {
    this.user.setStatus("online").then(() => {}).catch(() => {});
    this.user.setPresence(rotation[this.currentStatus]);

    this.interval = setInterval(() => {
      if (this.currentStatus < rotation.length) {
        this.currentStatus++;
      } else {
        this.currentStatus = 0;
      }

      this.user.setPresence(rotation[this.currentStatus]).then(() => {}).catch(() => {});
    }, delay);
  }

  cleanup() {
    this.user.setStatus("idle").then(() => {}).catch(() => {});

    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}
