const Command = require('./command.js');
const fs = require('fs');

const options = {
    "keyword": "trap",
    "commands": [],
    "requires": []
}

class Trap extends Command {
    constructor(subdomainInfo) {
        super(subdomainInfo, options);
    }

    execute(message, garnerInfo) {
        fs.readdir('./images/trap', (err, files) => {
            if (err) {
                console.trace(err);
            } else {
                const name = this.random.pick(files);

                message.channel.sendFile('./images/trap/'+name, name)
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

module.exports = Trap;