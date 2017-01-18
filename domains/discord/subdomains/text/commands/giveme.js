const Command = require('./command.js');

const options = {
	"keyword": "giveme",
	"commands": [],
	"requires": []
}

class Giveme extends Command {
	constructor(commands) {
        super(commands, options);
	}

	execute(message, garnerInfo) {

	}

    help(command) {

    }
}

module.exports = Giveme;