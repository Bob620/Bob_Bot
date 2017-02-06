const Command = require('./command.js');
const fs = require('fs');

const options = {
  "keyword": "megumin",
  "commands": [],
  "requires": []
}

class Megumin extends Command {
  constructor(subdomainInfo) {
    super(subdomainInfo, options);
  }

  execute(message, garnerInfo) {
    fs.readdir('./images/megumin', (err, files) => {
      if (err) {
        console.trace(err);
      } else {
        const name = this.random.pick(files);

        message.channel.sendFile('./images/megumin/'+name, name)
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

module.exports = Megumin;
