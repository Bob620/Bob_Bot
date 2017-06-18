const Task = require('./../../../util/task.js');

const results = [
  'I flipped a catgirl and she landed ***ears*** up',
  'I flipped a catgirl and she landed ***tail*** up'
]
const options = {
  "id": "flip",
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
    const textToSend = this.domain.modules.random.pick(results);
    message.channel.send(textToSend)
    .then(() => {
    })
    .catch((err) => {
      console.log(err);
    })
  }

  help(text) {

  }
}
