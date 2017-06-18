const Task = require('./../../../util/task.js');

const options = {
  id: 'help',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  supports(message) {
    const content = message.content.toLowerCase().split(' ');

    if (content[0] === `!${this.id}`) {
      return true;
    }
    return false;
  }

  execute(message) {
    let helpMessage = '**Temporary Server Command Help**\n';

    this.domain.subDomains.get('text').tasks.forEach((task, id) => {
      if (id !== 'placeholder') {
        helpMessage += `!${id}\n`;
      }
    });

    message.author.send(helpMessage);
  }

  help(text) {

  }
}
