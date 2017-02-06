const Command = require('./command.js');

const options = {
  "keyword": "general",
  "commands": [],
  "requires": []
}

class General extends Command {
  constructor(subdomainInfo) {
    super(subdomainInfo, options);
  }

  execute(message, garnerInfo) {

  }

  help(command) {

  }
}

module.exports = General;
