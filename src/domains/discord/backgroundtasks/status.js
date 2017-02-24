coconst Task = require('./src/util/task.js');

const options = {
  "id": "status"
}

class Status extends Task {
  constructor(domain) {
    super(domain, options);
  }

  execute() {

  }
}
