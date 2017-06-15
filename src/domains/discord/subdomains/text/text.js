const SubDomain = require('./../../../../util/subdomain.js');

const options = {
  "id": "text"
}

class Text extends SubDomain {
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
//        this.domain.backgroundTasks.counter.update(message.id, task.id);
        break;
      }
    }
  }
}

module.exports = Text;
