const Task = require('./../../../util/task.js');
const fs = require('fs');

const options = {
  "id": "placeholder",
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

  }

  help(text) {

  }
}
