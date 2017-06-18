const SubDomain = require('./../../../../util/subdomain.js');

const options = {
  id: 'dm'
}

class Dm extends SubDomain {
  constructor(domain, directory) {
    super(domain, directory, options);
  }

  supports(message) {
    if (message.channel.type === this.id) {
      return true;
    }
    return false;
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

module.exports = Dm;
