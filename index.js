const Garner = require('./Garner.js');
const Discord = require('discord.js');

const textParser = require('./TextParser.js');
const dmParser = require('./DmParser.js');
const groupParser = require('./GroupParser.js');

module.exports = class {
    constructor({garner: {server: serverLogin = false}, botToken: botToken = false}) {
        if (serverLogin && botToken) {
            this.ServerGarner = new Garner(serverLogin);
            this.client = new Discord.Client();

            this.client.on('message', (message) => {
                this.messageParse(message);
            });
            this.client.login(botToken);
        } else {
            throw "A Bot Token and Server Login required.";
        }
    }
    messageParse(message) {
        if (!message.system && !message.pinned && message.author.id !== this.client.user.id) {
            switch(message.channel.type) {
                case "text":
                    textParser(this.ServerGarner, message);
                    break;
                case "dm":
                    dmParser(this.ServerGarner, message);
                    break;
                case "group":
                    groupParser(this.ServerGarner, message);
                    break;
            }
        }
    }
}