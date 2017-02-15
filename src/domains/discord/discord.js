const Domain = require('./../util/domain.js');

const serverType = "discord";
const options = {
  "requirements": ["random", "log"]
}

class Discord extends Domain {
  constructor() {
    super(serverType, options);

    this.addSubDomains();
  }

  ready() {

  }

  connect() {

  }

  disconnect() {

  }

  message(message) {

  }
}

module.exports = Discord;
