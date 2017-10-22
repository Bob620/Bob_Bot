const Task = require('./../../../util/picturetask.js');

const options = {
  id: 'rem',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }
}
