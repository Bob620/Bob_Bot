const Task = require('./../../../util/task.js');

const options = {
  "id": "website",
  "url": "http://bobco.moe/waifu"
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  supports(message) {
    const content = message.content.toLowerCase().split(" ");

    if (content[0] === `!${this.id}`) {
      return true;
    }
    return false;
  }

  execute(message) {
    const channel = message.channel;

//    channel.send(`Please visit ${options.url} for all your Waifu Needs!`)
//    .then(() => {}).catch(() => {});
  }

  help(text) {

  }
}
