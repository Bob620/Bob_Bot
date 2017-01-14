const Command = require('./command.js');

const options = {
	"keyword": "prefix",
	"commands": [],
	"requires": []
}

class Prefix extends Command {
	constructor() {
        super(options);
	}

	execute(message, garnerInfo) {

	}
}

module.exports = Prefix;