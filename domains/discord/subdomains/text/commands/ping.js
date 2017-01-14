const Command = require('./command.js');

const options = {
	"keyword": "ping",
	"commands": [],
	"requires": []
}

class Ping extends Command {
	constructor() {
        super(options);
	}

	execute(message, garnerInfo) {
		message.channel.sendMessage("Pong")
		.then(() => {

		})
		.catch(() => {

		});
	}
}

module.exports = Ping;