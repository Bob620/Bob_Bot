const Command = require('./command.js');

const options = {
	"keyword": "prefix",
	"commands": [],
	"requires": []
}

class Prefix extends Command {
	constructor(commands) {
        super(commands, options);
	}

	execute(message, garnerInfo) {

	}

    help(command) {

    }
}

module.exports = Prefix;