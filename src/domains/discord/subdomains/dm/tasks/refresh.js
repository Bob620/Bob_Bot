const Task = require('./../../../../../util/task.js');
const fs = require('fs');

const options = {
  id: 'refresh',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  execute(message) {
    if (message.author.id == '69096215068811264') { // My userID, change later
      this.domain.subDomains.forEach((subdomain) => {
        subdomain.tasks.forEach((task) => {
          if (task.pictures !== undefined) {
            task.pictures = [];
          }
        });
      });
      message.reply('All picture tasks cache cleared');
    }
  }
}
