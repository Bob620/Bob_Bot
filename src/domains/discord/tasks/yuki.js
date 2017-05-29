const Task = require('./../../../util/task.js');
const fs = require('fs');

const images = "./images/yuki/";
const options = {
  "id": "yuki",
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
        channel.send('Doesn\'t seem that there are any pictures for this command yet')
        .then(() => {
          channel.stopTyping();
        })
        .catch((err) => {
          channel.stopTyping();
          console.log(err);
        });
        console.trace(err);
      } else {
        files = files.filter((file) => {
          if(file !== 'desktop.ini')
            return true;
          return false;
        });

        if (files.length > 0) {

          const name = this.domain.modules.random.pick(files);

          channel.send({file: images+name})
          .then(() => {
            channel.stopTyping();
          })
          .catch((err) => {
            channel.stopTyping();
            console.log(err);
          });
        } else {
          channel.send('Doesn\'t seem that there are any pictures for this command yet')
          .then(() => {
            channel.stopTyping();
          })
          .catch((err) => {
            channel.stopTyping();
            console.log(err);
          });
        }
      }
    });
  }

  help(text) {

  }
}
