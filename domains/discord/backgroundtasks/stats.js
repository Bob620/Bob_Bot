const BackgroundTask = require('./backgroundtask.js');

const options = {
  "keyword": "stats"
}

class Stats extends BackgroundTask {
  constructor(domainInfo) {
    super(domainInfo, options);

  }

  start() {

  }
}

module.exports = Stats;
