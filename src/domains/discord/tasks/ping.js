const Task = require('./../../../util/task.js');

const options = {
  id: 'ping',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  execute(message, garnerInfo) {
    message.channel.send('Pong!')
    .then((pongMessage) => {
      pongMessage.edit(`Pong!\n - Last Detected Latency: **${this.domain.debug.latency}**\n - Total Round Trip Time: **${pongMessage.createdTimestamp - message.createdTimestamp} ms**`);
    })
    .catch(() => {

    });
  }
}
