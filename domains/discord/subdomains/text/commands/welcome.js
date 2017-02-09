const Command = require('./command.js');

const options = {
  "keyword": "welcome",
  "commands": [],
  "requires": []
}

class Welcome extends Command {
  constructor(subdomainInfo) {
    super(subdomainInfo, options);
  }

  execute(message, garnerInfo) {

  }

  help(command) {

  }
}

module.exports = Welcome;
