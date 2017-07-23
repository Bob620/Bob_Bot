const Task = require('./../../../util/picturetask.js');

const options = {
  id: 'ram',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }
}
