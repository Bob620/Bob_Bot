const fs = require('fs');
const GarnerInfo = require('./../../garnerinfo/garnerinfo.js');

class Chatroom {
    constructor(subdomains, garnerObject, random, chata) {
        this.type = "chatroom";
        this.garner = garnerObject;
        this.random = random;
        this.chata = chata;
        this.commands = [];
        this.cache = {};

        this.populateCommands()
        .then(() => {

        })
        .catch(() => {

        });
    }

    supports(message) {
        return true;
    }

    execute(message) {
        return new Promise((resolve, reject) => {
            this.getGarnerInfo()
            .then((garnerInfo) => {
                const commands = this.commands;
                for (let i = 0; i < commands.length; i++) {
                    const command = commands[i];
                    if (command.supports(message, garnerInfo)) {
                        resolve(command.execute(message, garnerInfo));
                        break;
                    }
                }
            })
            .catch((err) => {
                console.log("Error returning GarnerInfo");
                reject(err);
            });
        });
    }

    getGarnerInfo() {
        // Use cache and/or garner
        return new Promise((resolve, reject) => {
            resolve({prefix: "!"});
            /*
            const garnerInfoCache = this.cache[id];
            if (garnerInfoCache) {
                if (garnerInfoCache.expires < process.uptime()) {
                    garnerInfoCache.populate()
                    .then(() => {
                        resolve(garnerInfoCache);
                    })
                    .catch(() => {
                        console.log("Unable to update garnerInfo");
                        resolve(garnerInfoCache);
                    });
                }
            } else {
                this.cache[id] = new GarnerInfo(id, this.garner);
                const garnerInfoCache = this.cache[id];

                garnerInfoCache.populate()
                .then(() => {
                    resolve(garnerInfoCache);
                })
                .catch(() => {
                    console.log("Unable to update garnerInfo");
                    resolve(garnerInfoCache);
                });
            }
            */
        });
    }

    populateCommands() {
        // Search ./commands
        return new Promise((resolve, reject) => {
            fs.readdir("./domains/toka/subdomains/chatroom/commands", (err, files) => {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file !== "command.js") {
                        const Command = require("./commands/"+file);
                        this.commands.push(new Command({commands: this.commands, random: this.random, chata: this.chata}));
                    }
                }
                resolve(this.commands.length);
            });
        });
    }
}

module.exports = Chatroom;