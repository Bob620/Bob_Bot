const Command = require('./command.js');
const fs = require('fs');

const options = {
    "keyword": "taka",
    "commands": [],
    "requires": []
}

class Taka extends Command {
    constructor(subdomainInfo) {
        super(subdomainInfo, options);
    }

    execute(message, garnerInfo) {
        fs.readdir('./images/taka', (err, files) => {
            if (err) {
                console.trace(err);
            } else {
                const name = this.random.pick(files);

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