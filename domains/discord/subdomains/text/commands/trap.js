const Command = require('./command.js');
const fs = require('fs');

const options = {
	"keyword": "trap",
	"commands": [],
	"requires": []
}

class Trap extends Command {
	constructor(commands) {
        super(commands, options);
	}

	execute(message, garnerInfo) {
/*        fs.readdir('./images/trap', (err, files) => {
            if (err) {
            	console.trace(err);
            } else {
                const totalFiles = files.length;
                const name = files[Math.floor(Math.random() * totalFiles)];

                message.channel.sendFile('./images/trap/'+name, name)
                .then(() => {

                })
                .catch((err) => {
                    console.log(err);
                })
            }
        });
*/	}

    help(command) {

    }
}

module.exports = Trap;