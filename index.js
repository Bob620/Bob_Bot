const fs = require('fs');
const Garner = require('./garner.js');
const Discord = require('discord.js');
const Chata = require('chata-client');
const Random = require('random-js');

module.exports = class {
    constructor({garner: {server: serverLogin = false}, discordToken: discordToken = false, chataToken = false}) {
        if (serverLogin && discordToken && chataToken) {
            this.garner = new Garner(serverLogin);
            this.discord = new Discord.Client();
            this.chata = new Chata();
            this.domains = [];
            this.random = new Random(Random.engines.mt19937().autoSeed());

            this.getDomains();

            this.discord.login(discordToken);
            this.chata.login(chataToken);
        } else {
            throw "A Bot Token and garner login required.";
        }
    }

    getDomains() {
        // Search ./domains
        fs.readdir("./domains", (err, files) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const Domain = require("./domains/"+file+"/"+file+".js");

                const domain = new Domain(this.garner, {discord: this.discord, chata: this.chata}, this.random);

                this.domains.push(domain);
            }
        });
    }
}