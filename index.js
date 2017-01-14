const fs = require('fs');
const Garner = require('./garner.js');
const Discord = require('discord.js');

module.exports = class {
    constructor({garner: {server: serverLogin = false}, botToken: botToken = false}) {
        if (serverLogin && botToken) {
            this.ServerGarner = new Garner(serverLogin);
            this.client = new Discord.Client();
            this.domains = [];

            this.getDomains();

            this.client.login(botToken);
        } else {
            throw "A Bot Token and garner login required.";
        }
    }

    getDomains() {
        // Search ./domains
        fs.readdir("./domains", (err, files) => {
            for (let i = 0; i < files.length; i++) {
                const domain = files[i];
                const Domain = require("./domains/"+domain+"/"+domain+".js");
                this.domains.push(new Domain(this.ServerGarner, this.client));
            }
        });
    }
}