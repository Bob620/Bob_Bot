const Garner = require('./Garner.js');
const Discord = require('discord.js');

const TextParser = require('./TextParser.js');
const DmParser = require('./DmParser.js');
const GroupParser = require('./GroupParser.js');
const Server = require('./Server.js');

const cacheExpire = 10;

module.exports = class {
    constructor({garner: {server: serverLogin = false}, botToken: botToken = false}) {
        if (serverLogin && botToken) {
            this.ServerGarner = new Garner(serverLogin);
            this.client = new Discord.Client();
            this.cache = {
                "text": {},
                "dm": {},
                "group": {}
            };

            this.client.on('message', (message) => {
                this.messageParse(message);
            });
            this.client.on('error', (err) => {
                console.log("An error occured:");
                console.log(err);
            });
            this.client.on('disconnect', () => {
               console.log('Disconnected'); 
            });
            this.client.on('reconnecting', () => {
                console.log('Reconnecting...');
            });
            this.client.on('ready', () => {
                console.log('Connected and ready');
            });
            
            this.client.login(botToken);
        } else {
            throw "A Bot Token and garner login required.";
        }
    }
    messageParse(message) {
        if (!message.system && !message.pinned && message.author.id !== this.client.user.id) {
            switch(message.channel.type) {
                case "text":
                    this.getTextServer(message.guild.id)
                    .then((server) => {
                        if (server) {
                            TextParser.parse(server, message);
                        }
                    })
                    .catch((err, server) => {
                        console.log("Fatal message error populating textServer.");
                        console.log(err);
                        console.log("Using last avalible population.");
                        if (server) {
                            TextParser.parse(server, message);
                        } else {
                            console.log("Unable to retrive pervious population");
                        }
                    });
                    break;
                case "dm":
                    break;
                case "group":
                    break;
            }
        }
    }
    getTextServer(id) {
        const textServer = this.cache.text[id];
        if (textServer && textServer.expire > process.uptime()) {
            return Promise.resolve(textServer.server);
        } else {
            return new Promise((resolve, reject) => {
                const server = new Server(id, this.ServerGarner);
                server.populate()
                .then(() => {
                    if (this.cache.text[id]) {
                        delete this.cache.text[id];
                    }
                    
                    this.cache.text[id] = {
                        "server": server,
                        "expire": process.uptime()+cacheExpire
                    };
                    resolve(server);
                })
                .catch((err) => {
                    reject(err, this.cache.text[id].server);
                });
            });
        }
    }
}