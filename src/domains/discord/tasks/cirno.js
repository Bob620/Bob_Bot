const Task = require('./../../../util/task.js');
const fs = require('fs');

const baseURL = "http://i.bobco.moe/";
const options = {
  "id": "cirno",
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

    const params = {
      ExpressionAttributeNames: {
        "#URL": "url",
        "#TAGS": "tags"
      },
      ExpressionAttributeValues: {
        ":tag": {S: options.id}
      },
      FilterExpression: "contains(#TAGS, :tag)",
      ProjectionExpression: "#URL",
      TableName: "picturebase"
    }

    this.domain.modules.dynamodb.scan(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        const picture = this.domain.modules.random.pick(data.Items);
        message.channel.sendEmbed({'image': {'url': 'http://i.bobco.moe/'+picture.url.S}})
        .catch((err) => {
          console.log(err);
        })
        .then(() => {

        });
      }
    });
  }

  help(text) {

  }
}
