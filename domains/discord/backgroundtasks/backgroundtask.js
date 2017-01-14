class BackgroundTask {
	constructor(subdomains, backgroundTasks, garnerObject, discord, botStatus) {
		this.subdomains = subdomains;
		this.backgroundTasks = backgroundTasks;
		this.garner = garnerObject;
		this.discord = discord;
		this.botStatus = botStatus;
	}

	get status() {
		return this.botStatus();
	}
}

module.exports = BackgroundTask;