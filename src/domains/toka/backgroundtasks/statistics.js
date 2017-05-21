const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "statistics"
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  execute() {
  }

  cleanup() {
  }
}
