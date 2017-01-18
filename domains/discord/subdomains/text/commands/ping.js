const Command = require('./command.js');

const options = {
	"keyword": "ping",
	"commands": [],
	"requires": []
}

class Ping extends Command {
	constructor(commands) {
        super(commands, options);
	}

	execute(message, garnerInfo) {
		message.channel.sendMessage("Pong")
		.then(() => {

		})
		.catch(() => {

		});
	}

    help(command) {

    }
}

module.exports = Ping;