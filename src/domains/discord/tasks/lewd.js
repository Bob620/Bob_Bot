const Task = require('./../../../util/task.js');
const fs = require('fs');

const options = {
  "id": "lewd",
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

  execute(message) {
    message.channel.send("Rub it all over me")
    .then(() => {
    })
    .catch((err) => {
      console.log(err);
    })
  }

  help(text) {

  }
}
