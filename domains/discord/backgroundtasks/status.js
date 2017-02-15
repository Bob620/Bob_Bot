const BackgroundTask = require('./backgroundtask.js');

const options = {
  "keyword": "status"
}

const rotationSpeed = 15000;
const rotation = [
  {
    "status": "online",
    "game": {
      "name": "New version soon(TM)!"
    }
  },
  {
    "status": "online",
    "game": {
      "name": "!taka"
    }
  },
  {
    "status": "online",
    "game": {
      "name": "!tor"
    }
  },
  {
    "status": "online",
    "game": {
      "name": "!help"
    }
  },
  {
    "status": "online",
    "game": {
      "name": "Looking for Traps!"
    }
  },
  {
    "status": "online",
    "game": {
      "name": "TRUE RANDOMNESS"
    }
  }

];

class Status extends BackgroundTask {
  constructor(domainInfo) {
    super(domainInfo, options);

    this.timer = undefined;
    this.currentRotation = 0;
  }

  start() {
    this.changeStatus();
    this.timer = setInterval(this.changeStatus.bind(this), rotationSpeed);
  }

  stop() {
    clearInterval(this.timer);
  }

  changeStatus() {
    if (this.status === "connected") {
      if (this.currentRotation+1 >= rotation.length) {
        this.currentRotation = 0;
      } else {
        this.currentRotation += 1;
      }

      this.discord.user.setPresence(rotation[this.currentRotation])
      .then(() => {

      })
      .catch(() => {
        this.currentRotation -= 1;
      });
    }
  }
}

module.exports = Status;
