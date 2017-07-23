const Task = require('./../../../util/task.js');

const options = {
  id: 'website',
  url: 'http://bobco.moe/waifu'
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  async execute(message) {
    const channel = message.channel;

    await channel.send(`Please visit ${options.url} for all your Waifu Needs!`);
  }
}
