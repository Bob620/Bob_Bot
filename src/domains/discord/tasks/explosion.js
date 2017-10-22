const Task = require('./../../../util/picturetask.js');

const options = {
  id: 'explosion',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  supports(message) {
    return new Promise((resolve, reject) => {
      if (this.regex.exec(message.cleanContent) && (message.author.id == '144670512956702730' || message.author.id == '69096215068811264')) {
        reject(this);
      } else {
        resolve(this);
      }
    });
  }
}
