const BackgroundTask = require('./backgroundtask.js');

class Stats extends BackgroundTask {
	constructor(subdomains, backgroundTasks, garnerObject, discord, botStatus) {
		super(subdomains, backgroundTasks, garnerObject, discord, botStatus);

	}

	start() {

	}
}

module.exports = Stats;