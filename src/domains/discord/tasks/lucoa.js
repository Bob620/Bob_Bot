const Task = require('./../../../util/task.js');
const fs = require('fs');

const images = "./images/lucoa/";
const options = {
  "id": "lucoa",
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
          if (message.author.id === "98863753897971712") {
            channel.send({file: images+"e3869a06fe83c80447afa87c69da47e0.png"})
            .then(() => {
              channel.stopTyping();
            })
            .catch((err) => {
              channel.stopTyping();
              console.log(err);
            });
          } else {
            const name = this.domain.modules.random.pick(files);

            channel.send({file: images+name})
            .then(() => {
              channel.stopTyping();
            })
            .catch((err) => {
              channel.stopTyping();
              console.log(err);
            });
          }
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
