const Command = require('./command.js');

const options = {
	"keyword": "general",
	"commands": [],
	"requires": []
}

class General extends Command {
	constructor() {
        super(options);
	}

	execute(message, garnerInfo) {

	}
}

module.exports = General;