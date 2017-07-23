const SubDomain = require('./../../../../util/subdomain.js');

const options = {
  id: 'text'
}

class Text extends SubDomain {
  constructor(domain, directory) {
    super(domain, directory, options);
  }

  supports(message) {
    return new Promise((resolve, reject) => {
      if (message.channel.type === this.id) {
        reject(this);
      } else {
        resolve(this);
      }
    });
  }

  async execute(message) {
    let tasks = [];
    this.tasks.forEach((task) => {
      tasks.push(task.supports(message));
    });

    Promise.all(tasks)
    .then(() => {})
    .catch((command) => {
      command.execute(message);
    });
  }
}

module.exports = Text;
