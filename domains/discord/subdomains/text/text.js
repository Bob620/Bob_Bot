const fs = require('fs');
const GarnerInfo = require('./../../garnerinfo/garnerinfo.js');

// Guild Text Chat
class Text {
  constructor({subdomains: subdomains, garner: garner, random: random, backgroundTasks: backgroundTasks, botStatus: botStatus}) {
    this.garner = garner;
    this.random = random;
    this.backgroundTasks = backgroundTasks;
    this.botStatus = botStatus;
    this.commands = [];
    this.cache = {};
    this.type = "text";

    this.populateCommands()
    .then(() => {

    })
    .catch(() => {

    });
  }

  supports(message) {
    if (message.guild && message.channel.type === this.type) {
      return true;
    }
    return false;
  }

  execute(message) {
    return new Promise((resolve, reject) => {
      this.getGarnerInfo(message.guild.id)
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

  getGarnerInfo(id) {
    // Use cache and/or garner
    return new Promise((resolve, reject) => {
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
    });
  }

  populateCommands() {
    // Search ./commands
    return new Promise((resolve, reject) => {
      fs.readdir("./domains/discord/subdomains/text/commands", (err, files) => {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file !== "command.js") {
            const Command = require("./commands/"+file);
            this.commands.push(new Command({commands: this.commands, random: this.random, backgroundTasks: this.backgroundTasks, botStatus: this.botStatus}));
          }
        }
        resolve(this.commands.length);
      });
    });
  }
}

module.exports = Text;
