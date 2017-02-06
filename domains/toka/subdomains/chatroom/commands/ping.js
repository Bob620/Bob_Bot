const Command = require('./command.js');

const options = {
  "keyword": "ping",
  "commands": [],
  "requires": []
}

class Ping extends Command {
  constructor(subdomainInfo) {
    super(subdomainInfo, options);
  }

  execute(message, garnerInfo) {
    this.chata.sendMessage("toka", "Pong!")
  }

  help(command) {

  }
}

module.exports = Ping;
