const Command = require('./command.js');

const options = {
    "keyword": "filter",
    "commands": ["set", "remove", "list", "watch", "ignore"],
    "requires": []
}

class Filter extends Command {
    constructor() {
        super(options);
    }

    execute(message, garnerInfo) {

    }
}

module.exports = Filter;