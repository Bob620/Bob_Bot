const fs = require('fs');

class Toka {
    constructor(garner, discord) {
        this.garner = garner;
        this.discord = discord;
        this.status = "disconnected";
    }

    getSubdomains() {
        // Search ./subdomains
        fs.readdir("./subdomains", (err, files) => {
            for (let i = 0; i < files.length; i++) {
                const subdomain = files[i];
                const SubDomain = require("./subdomains/"+subdomain+"/"+subdomain+".js");
                this.subdomains.push(new SubDomain(this.subdomains, this.garner));
            }
        });
    }

    getBackgroundTasks() {
        // Search ./backgroundtasks
        fs.readdir("./backgroundtasks", (err, files) => {
            for (let i = 0; i < files.length; i++) {
                const backgroundTask = files[i];
                const BackgroundTask = require("./backgroundtasks/"+backgroundTask+".js");
                this.backgroundTasks.push(new BackgroundTask(this.subdomains, this.backgroundTasks, this.garner, this.discord, this.status));
            }
        });
    }

    startBackgroundTasks() {
        // Start all background tasks
        const backgroundTasks = this.backgroundTasks;
        for (let i = 0; i < backgroundTasks.length; i++) {
            backgroundTasks[i].start();
        }
    }
}

module.exports = Toka;