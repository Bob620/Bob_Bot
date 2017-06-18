const Task = require('./../../../util/task.js');
const util = require('util');
let scan;

const baseURL = 'http://i.bobco.moe/';
const options = {
  id: 'ai',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    const dynamodbWestTwo = this.domain.modules.dynamodbWestTwo;
    scan = util.promisify(dynamodbWestTwo.scan.bind(dynamodbWestTwo));
  }

  supports(message) {
    const content = message.content.toLowerCase().split(' ');

    if (content[0] === `!${this.id}`) {
      return true;
    }
    return false;
  }

  async execute(message) {
    const channel = message.channel;

    let params = {
      ExpressionAttributeNames: {
        '#URL': 'url',
        '#TAGS': 'tags'
      },
      ExpressionAttributeValues: {
        ':tag': {S: options.id}
      },
      FilterExpression: 'contains(#TAGS, :tag)',
      ProjectionExpression: '#URL',
      TableName: 'picturebase'
    }
    let pictures = [];

    // On failure log things
    try {
      // Promise newMessage and scan for the first set of images
      const [newMessage, baseData] = await Promise.all([channel.send({embed: {text: ''}}), scan(params)]);
      params.ExclusiveStartKey = baseData.LastEvaluatedKey;
      pictures = pictures.concat(baseData.Items);

      // Loop over any more images
      while (params.LastEvaluatedKey !== undefined) {
        const data = await scan(params);
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        pictures = pictures.concat(data.Items);
      }

      // Get a random image from the ones retrived
      const picture = this.domain.modules.random.pick(pictures);
      if (picture !== undefined) {
        // Edit the new message with the selected image
        await newMessage.edit({embed: {image: {url: `${baseURL}${picture.url.S}`}}});
      }
    } catch(err) {
      console.log(err);
    }
  }

  help(text) {

  }
}
