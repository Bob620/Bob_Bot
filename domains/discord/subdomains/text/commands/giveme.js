const Command = require('./command.js');

const options = {
	"keyword": "giveme",
	"commands": [],
	"requires": []
}

class Giveme extends Command {
	constructor() {
        super(options);
	}

	execute(message, garnerInfo) {

	}
}

module.exports = Giveme;