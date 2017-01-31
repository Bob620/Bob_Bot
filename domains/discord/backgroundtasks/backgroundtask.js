class BackgroundTask {
    constructor({subdomain: subdomains, backgroundTask: backgroundTasks, garner: garner, discord: discord, botStatus: botStatus, random: random}) {
        this.subdomains = subdomains;
        this.backgroundTasks = backgroundTasks;
        this.garner = garner;
        this.discord = discord;
        this.botStatus = botStatus;
        this.random = random;
    }

    get status() {
        return this.botStatus();
    }
}

module.exports = BackgroundTask;