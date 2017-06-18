const Task = require('./../../../../../util/task.js');

const options = {
  id: 'nlpds',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  supports(message) {
    return true;
  }

  execute(message) {
    const modules = this.domain.modules;
    const uid = modules.intformat(modules.flakeId.next(), 'dec');
    this.domain.modules.dynamodbEastOne.putItem({
      Item: {
        snowflake_id: {S: uid},
        message: {S: message.text},
        timestamp: {S: message.timestamp},
        user: {S: message.username}
      },
      TableName: 'nlp-ds'
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
    });
  }

  help(text) {

  }
}
