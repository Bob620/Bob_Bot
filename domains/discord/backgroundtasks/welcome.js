const BackgroundTask = require('./backgroundtask.js');

const options = {
  "keyword": "welcome"
}

class Welcome extends BackgroundTask {
  constructor(domainInfo) {
    super(domainInfo, options);

  }

  start() {

  }
}

module.exports = Welcome;
