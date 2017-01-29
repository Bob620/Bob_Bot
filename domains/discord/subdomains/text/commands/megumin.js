const Command = require('./command.js');
const fs = require('fs');

const options = {
	"keyword": "megumin",
	"commands": [],
	"requires": []
}

class Megumin extends Command {
	constructor(commands) {
        super(commands, options);
	}

	execute(message, garnerInfo) {
        if (message.author.id === "235450058911383553") {
            message.channel.sendMessage('Baka')
            .then(() => {

            })
            .catch((err) => {
                console.log(err);
            })
        } else {
            fs.readdir('./images/megumin', (err, files) => {
                if (err) {
                	console.trace(err);
                } else {
                    const totalFiles = files.length;
                    const name = files[Math.floor(Math.random() * totalFiles)];

                    message.channel.sendFile('./images/megumin/'+name, name)
                    .then(() => {

                    })
                    .catch((err) => {
                        console.log(err);
                    })
                }
            });
        }
	}

    help(command) {

    }
}

module.exports = Megumin;