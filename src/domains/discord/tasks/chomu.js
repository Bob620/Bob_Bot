const Task = require('./../../../util/task.js');
const fs = require('fs');

const images = "./images/chomu/";
const options = {
  "id": "chomu",
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
    const channel = message.channel;

    channel.startTyping();
    fs.readdir(images, (err, files) => {
      if (err) {
        console.trace(err);
      } else {
        const name = this.domain.modules.random.pick(files);

        channel.send({file: images+name})
        .then(() => {
          channel.stopTyping();
        })
        .catch((err) => {
          channel.stopTyping();
          console.log(err);
        })
      }
    });
  }

  help(text) {

  }
}
