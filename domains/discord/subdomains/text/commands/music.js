const Command = require('./command.js');

const options = {
	"keyword": "music",
	"commands": [],
	"requires": []
}

class Music extends Command {
	constructor() {
        super(options);
	}

	execute(message, garnerInfo) {

	}
}

module.exports = Music;