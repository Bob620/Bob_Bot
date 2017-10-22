const Task = require('./../../../util/picturetask.js');

const options = {
  id: 'momoiji',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }
}
