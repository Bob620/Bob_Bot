class BackgroundTask {
    constructor({subdomain: subdomains, backgroundTask: backgroundTasks, garner: garner, chata: chata, botStatus: botStatus, random: random}) {
        this.subdomains = subdomains;
        this.backgroundTasks = backgroundTasks;
        this.garner = garner;
        this.chata = chata;
        this.botStatus = botStatus;
        this.random = random;
    }

    get status() {
        return this.botStatus();
    }
}

module.exports = BackgroundTask;