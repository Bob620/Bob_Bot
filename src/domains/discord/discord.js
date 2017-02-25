const Domain = require('./../../util/domain.js');

const serverType = "discord";
const options = {
  "requirements": ["random", "log"],
  "subDomainDirectory": `${__dirname}/subdomains`,
  "backgroundTaskDirectory": `${__dirname}/backgroundtasks`
}

class Discord extends Domain {
  constructor() {
    super(serverType, options);
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
