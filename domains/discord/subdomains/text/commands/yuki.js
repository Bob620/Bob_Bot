const Command = require('./command.js');
const fs = require('fs');

const options = {
  "keyword": "yuki",
  "commands": [],
  "requires": []
}

class Yuki extends Command {
  constructor(subdomainInfo) {
    super(subdomainInfo, options);
  }

  execute(message, garnerInfo) {
    fs.readdir('./images/yuki', (err, files) => {
      if (err) {
        console.trace(err);
      } else {
        const name = this.random.pick(files);

        message.channel.sendFile('./images/yuki/'+name, name)
        .then(() => {

        })
        .catch((err) => {
          console.log(err);
        })
      }
    });
  }

  help(command) {

  }
}

module.exports = Yuki;
