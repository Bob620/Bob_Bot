const Command = require('./command.js');
const fs = require('fs');

const options = {
	"keyword": "slap",
	"commands": [],
	"requires": []
}

class Slap extends Command {
	constructor(commands) {
        super(commands, options);
	}

	execute(message, garnerInfo) {
        fs.readdir('./images/slap', (err, files) => {
            if (err) {
            	console.trace(err);
            } else {
                const totalFiles = files.length;
                const name = files[Math.floor(Math.random() * totalFiles)];

                message.channel.sendFile('./images/slap/'+name, name)
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

module.exports = Slap;