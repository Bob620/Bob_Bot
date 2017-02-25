const SubDomain = require('./../../../../util/subdomain.js');

const options = {
  "id": "text",
  "taskDirectory": `${__dirname}/tasks`
}

class Text extends SubDomain {
  constructor(domain) {
    super(domain, options);
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

module.exports = Text;
