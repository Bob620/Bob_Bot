const Domain = require('./../../../util/domain.js');

const options = {
  "id" = "text",
  "taskDirectory": `${__dirname}/tasks`
}

class Discord extends Domain {
  constructor(domain) {
    super(domain, options);
  }
}

module.exports = Discord;
