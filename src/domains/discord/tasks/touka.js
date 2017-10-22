const Task = require('./../../../util/picturetask.js');

const options = {
  id: 'touka',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }
}
