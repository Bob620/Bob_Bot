const Command = require('./command.js');

const options = {
    "keyword": "filter",
    "commands": ["set", "remove", "list", "watch", "ignore"],
    "requires": []
}

class Filter extends Command {
    constructor(subdomainInfo) {
        super(subdomainInfo, options);
    }

    execute(message, garnerInfo) {

    }

    help(command) {

    }
}

module.exports = Filter;