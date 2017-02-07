const Command = require('./command.js');
const fs = require('fs');

const options = {
  "keyword": "kanna",
  "commands": [],
  "requires": []
}

class Kanna extends Command {
  constructor(subdomainInfo) {
    super(subdomainInfo, options);
  }

  execute(message, garnerInfo) {
    fs.readdir('./images/kanna', (err, files) => {
      if (err) {
        console.trace(err);
      } else {
        const name = this.random.pick(files);

        message.channel.sendFile('./images/kanna/'+name, name)
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

module.exports = Kanna;
