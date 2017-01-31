const Command = require('./command.js');

const options = {
    "keyword": "help",
    "commands": [],
    "requires": []
}

class Help extends Command {
    constructor(subdomainInfo) {
        super(subdomainInfo, options);
    }

    execute(message, garnerInfo) {

    }

    help(command) {

    }
}

module.exports = Help;