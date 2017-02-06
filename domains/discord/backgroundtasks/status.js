const BackgroundTask = require('./backgroundtask.js');

const rotationSpeed = 10000;
const rotation = [
  {
    "status": "online",
    "game": {
      "name": "New version near!"
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
      "name": "!megumin"
    }
  },
  {
    "status": "online",
    "game": {
      "name": "!slap"
    }
  },
  {
    "status": "online",
    "game": {
      "name": "!trap"
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
    super(domainInfo);

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
