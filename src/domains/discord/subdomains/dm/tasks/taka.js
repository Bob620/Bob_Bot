const Task = require('./../../../../../util/task.js');
const fs = require('fs');

const images = "./images/taka/";
const options = {
  "id": "taka",
}

class Taka extends Task {
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
    fs.readdir(images, (err, files) => {
      if (err) {
        console.trace(err);
      } else {
        const name = this.domain.modules.random.pick(files);

        message.channel.sendFile(images+name, name)
        .then(() => {

        })
        .catch((err) => {
          console.log(err);
        })
      }
    });
  }

  help(text) {

  }
}

module.exports = Taka;
