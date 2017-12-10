const Task = require('./../../../util/task.js');

const options = {
  id: 'arc',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  async execute(message) {
//    this.domain.server.connection.sendMessage('toka', 'Dang it arc!');
  }
}