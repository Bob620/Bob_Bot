const fs = require('fs');
//const Garner = require('./garner.js');
const Discord = require('discord.js');
const Chata = require('chata-client');
const Random = require('random-js');
const log = require('./util/log.js');

const options = {
  "domains": "domains"
}

class Bot {
  constructor({garner: {server: serverLogin = false}, discordToken: discordToken = false, chataToken = false}) {
    this.modules = {};

//    if (serverLogin) {
//      this.info["garner"] = new Garner(serverLogin);
//    }
    if (discordToken) {
      this.modules["discord"] = new Discord.Client({apiRequestMethod: "burst"});
      this.modules.discord.login(discordToken);
    }
    if (chataToken) {
      this.modules["chata"] = new Chata();
      this.modules.chata.login(chataToken);
    }

    if (Object.keys(this.modules).length > 0) {
      this.modules.random = new Random(Random.engines.mt19937().autoSeed());
      this.modules.log = log;

      this.domains = [];
      this.createDomains();

    } else {
      throw "A Bot Token required.";
    }
  }

  /**
   * Function used to create the underlying domains
   */
  createDomains() {
    // Search ./domains
    fs.readdir(options.domains, (err, files) => {
      files.forEach((file) => {
        const Domain = require(`./${options.domains}/${file}/${file}.js`);

        this.domains.push(new Domain());
      });
    });
  }

  /**
   * Function to begin/reset the underlying domains
   */
  startDomains() {
    this.domains.forEach((domain) => {
      let info = {"server": false, "requirements": {}};
      const domainRequirements = domain.requires();

      if (this.modules.hasOwnProperty(domainRequirements.serverType)) {
        info.server = this.modules[domainRequirements.serverType];
      } else {
        throw `Couldn't find the requested domain server ${domainRequirements.serverType}`;
      }

      const requirements = domainRequirements.requirements;
      for (let i = 0; i > requirements.length; i++) {
        const requireName = requirements[i];

        if (this.modules.hasOwnProperty(requireName)) {
          info.requirements[requireName] = this.modules[requireName];
        }
      }
      domain.start(info);
    });
  }
}

module.exports = Bot;
