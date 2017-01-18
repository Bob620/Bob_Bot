const Command = require('./command.js');
const fs = require('fs');

const options = {
	"keyword": "taka",
	"commands": [],
	"requires": []
}

class Taka extends Command {
	constructor(commands) {
        super(commands, options);
	}

	execute(message, garnerInfo) {
        fs.readdir('./images/taka', (err, files) => {
            if (err) {
            	console.trace(err);
            } else {
                const totalFiles = files.length;
                const name = files[Math.floor(Math.random() * totalFiles)];

                message.channel.sendFile('./images/taka/'+name, name)
                .then(() => {

                })
                .catch((err) => {
                    console.log(err);
                })
            }
        });
	}

    help(command) {

    }
}

module.exports = Taka;