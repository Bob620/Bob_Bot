const SubDomain = require('./../../../../util/subdomain.js');

const options = {
  id: 'default'
}

class Default extends SubDomain {
  constructor(domain, directory) {
    super(domain, directory, options);
  }

  supports(message) {
    return true;
  }

  execute(message) {
    const tasks = this.tasks.values();
    for (let i = 0; i < this.tasks.size; i++) {
      const task = tasks.next().value;
      if (task.supports(message)) {
        task.execute(message);
        break;
      }
    }
  }
}

module.exports = Default;
