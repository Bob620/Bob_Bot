const Task = require('./../../../util/task.js');

const options = {
  id: 'commands',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  async execute(message) {
    let helpMessage = '**Temporary Server Command Help**\n';

    this.domain.subDomains.get('text').tasks.forEach((task, id) => {
      if (id !== 'placeholder') {
        helpMessage += `!${id}\n`;
      }
    });

    message.author.send(helpMessage)
    .then(() => {})
    .catch((err) => {
      console.log(err);
      message.channel.send('Unable to send the help message. This could be caused by having PM/DMs turned off for non-friends.');
    });
  }
}