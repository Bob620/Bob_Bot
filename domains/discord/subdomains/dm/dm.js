const fs = require('fs');
const GarnerInfo = require('./../../garnerinfo/garnerinfo.js');

class Dm {
  constructor({subdomains: subdomains, garner: garner, random: random, backgroundTasks: backgroundTasks, botStatus: botStatus}) {
    this.garner = garner;
    this.random = random;
    this.backgroundTasks = backgroundTasks;
    this.botStatus = botStatus;
    this.commands = [];
    this.cache = {};
    this.type = "dm";

    this.getCommands();
  }

  supports(message) {
    if (message.guild && message.channel.type === this.type) {
      return true;
    }
    return false;
  }

  execute(message) {
    this.getGarnerInfo(message.guild.id)
    .then((garnerInfo) => {
      const commands = this.commands;
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (command.supports(message, garnerInfo)) {
          command.execute(message, garnerInfo);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("An error occured:");
      console.log(err);
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

  getCommands() {
    // Search ./commands
    fs.readdir("./domains/discord/subdomains/dm/commands", (err, files) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file !== "command.js") {
          const Command = require("./commands/"+file);
          this.commands.push(new Command({commands: this.commands, random: this.random, backgroundTasks: this.backgroundTasks, botStatus: this.botStatus}));
        }
      }
    });
  }
}

module.exports = Dm;
