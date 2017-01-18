const fs = require('fs');

class Discord {
    constructor(garner, discord) {
        this.garner = garner;
        this.discord = discord;
        this.botStatus = "disconnected";
        this.subdomains = [];
        this.backgroundTasks = [];

        // require all subdomains
        this.populateSubdomains()
        .then(() => {
        })
        .catch(() => {
        });

        // require all background tasks
        this.populateBackgroundTasks()
        .then(() => {
            // Start all background tasks
            this.startBackgroundTasks();
        })
        .catch(() => {
        });

        // Parse and send message to subdomain w/ garnerInfo
        discord.on('message', (message) => {
            const subdomains = this.subdomains;
            for (let i = 0; i < subdomains.length; i++) {
                const subdomain = subdomains[i];
                if (subdomain.supports(message)) {
                    subdomain.execute(message)
                    .then(() => {
                    })
                    .catch((err) => {
                        console.log("An error occured:");
                        console.trace(err);
                    });
                    break;
                }
            }
        });

        // Status
        discord.on('ready', () => {
            this.status = "connected";
        });

        discord.on('disconnect', () => {
            this.status = "disconnected";
        });

        discord.on('reconnecting', () => {
            this.status = "reconnecting";
        });

        discord.on('error', (err) => {
            console.log("An error occured");
            console.log(err);
        });
    }

    set status(status) {
        const date = new Date().toISOString().split('T');
        const largeDate = date[0];
        const smallDate = date[1].slice(0, -5);
        console.log(`${largeDate}|${smallDate}|DISCORD|Status| ${this.botStatus} -> ${status}`);
        this.botStatus = status;
    }

    get status() {
        return this.botStatus;
    }

    getStatus() {
        return this.botStatus;
    }

    populateSubdomains() {
        // Search ./subdomains
        return new Promise((resolve, reject) => {
            fs.readdir("./domains/discord/subdomains", (err, files) => {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const SubDomain = require("./subdomains/"+file+"/"+file+".js");
                    this.subdomains.push(new SubDomain(this.subdomains, this.garner));
                }
                resolve(true);
            });
        });
    }

    populateBackgroundTasks() {
        // Search ./backgroundtasks
        return new Promise((resolve, reject) => {
            fs.readdir("./domains/discord/backgroundtasks", (err, files) => {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file !== "backgroundtask.js") {
                        const BackgroundTask = require("./backgroundtasks/"+file);
                        this.backgroundTasks.push(new BackgroundTask(this.subdomains, this.backgroundTasks, this.garner, this.discord, this.getStatus.bind(this)));
                    }
                }
                resolve(true);
            });
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

module.exports = Discord;