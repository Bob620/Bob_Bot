const Command = require('./command.js');

const options = {
    "keyword": "giveme",
    "commands": [],
    "requires": []
}

class Giveme extends Command {
    constructor(subdomainInfo) {
        super(subdomainInfo, options);
    }

    execute(message, garnerInfo) {

    }

    help(command) {

    }
}

module.exports = Giveme;