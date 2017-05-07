const Task = require('./../../../util/task.js');
const fs = require('fs');

const options = {
  "id": "ping",
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  supports(message) {
    const content = message.content.toLowerCase().split(" ");

    if (content[0] === `!${this.id}`) {
      return true;
    }
    return false;
  }

  execute(message, garnerInfo) {
    message.channel.send("Pong!")
    .then((pongMessage) => {
      pongMessage.edit(`Pong! - Total Round Trip Time: **${pongMessage.createdTimestamp - message.createdTimestamp} ms**`);
    })
    .catch(() => {

    });
  }

  help(text) {

  }
}
