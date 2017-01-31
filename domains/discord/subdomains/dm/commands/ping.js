const Command = require('./command.js');

const options = {
    "keyword": "ping",
    "commands": [],
    "requires": []
}

class Ping extends Command {
    constructor(subdomainInfo) {
        super(subdomainInfo, options);
    }

    execute(message, garnerInfo) {
        message.channel.sendMessage("Pong!")
        .then((pongMessage) => {
            pongMessage.edit(`Pong! - Total Round Trip Time: **${pongMessage.createdTimestamp - message.createdTimestamp} ms**`);
        })
        .catch(() => {

        });
    }

    help(command) {

    }
}

module.exports = Ping;