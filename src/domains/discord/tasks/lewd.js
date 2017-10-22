const Task = require('./../../../util/task.js');

const options = {
  id: 'lewd',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  execute(message) {
    message.channel.send('Rub it all over me')
    .then(() => {
    })
    .catch((err) => {
      console.log(err);
    })
  }
}
