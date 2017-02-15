const Command = require('./command.js');
const fs = require('fs');

const options = {
  "keyword": "dance",
  "commands": [],
  "requires": []
}

class Dance extends Command {
  constructor(subdomainInfo) {
    super(subdomainInfo, options);
  }

  execute(message, garnerInfo) {
    fs.readdir('./images/dance', (err, files) => {
      if (err) {
        console.trace(err);
      } else {
        const name = this.random.pick(files);

        message.channel.sendFile('./images/dance/'+name, name)
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

module.exports = Dance;
