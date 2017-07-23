const Task = require('./task.js');
const util = require('util');
let scan;

const baseURL = 'http://i.bobco.moe/';

module.exports = class extends Task {
  constructor(domain, options) {
    super(domain, options);

    const dynamodbWestTwo = this.modules.dynamodbWestTwo;
    scan = util.promisify(dynamodbWestTwo.scan.bind(dynamodbWestTwo));
    this.pictures = [];
  }

  async execute(message) {
    const channel = message.channel;

    if (this.pictures.length === 0) {
      let params = {
        ExpressionAttributeNames: {
          '#URL': 'url',
          '#TAGS': 'tags'
        },
        ExpressionAttributeValues: {
          ':tag': {S: this.id}
        },
        FilterExpression: 'contains(#TAGS, :tag)',
        ProjectionExpression: '#URL',
        TableName: 'picturebase'
      }
      let baseData = false;
      let newMessage;

      // On failure log things and send a message
      try {
        // Promise newMessage and scan for the first set of images
        [newMessage, baseData] = await Promise.all([await channel.send({embed: {text: ''}}), scan(params)]);
        params.ExclusiveStartKey = baseData.LastEvaluatedKey;
        this.pictures = this.pictures.concat(baseData.Items);

        // Loop over any more images
        while (params.LastEvaluatedKey !== undefined) {
          const data = await scan(params);
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          this.pictures = this.pictures.concat(data.Items);
        }

        // Get a random image from the ones retrived
        const picture = this.domain.modules.random.pick(this.pictures);
        // Edit the new message with the selected image
        newMessage.edit({embed: {image: {url: `${baseURL}${picture.url.S}`}}});

        setTimeout(() => {
          this.pictures = [];
        }, 3600000);
      } catch(err) {
        // Send an error message on failure
        if (newMessage === undefined) {
          newMessage.edit({embed: {description: 'Doesn\'t seem that there are any pictures for this command yet'}});
        } else {
          channel.send('Doesn\'t seem that there are any pictures for this command yet');
        }
        // Log the actual error
        console.log(err);
      }
    } else {
      // Get a random image from the ones retrived
      const picture = this.domain.modules.random.pick(this.pictures);
      // Edit the new message with the selected image
      channel.send({embed: {image: {url: `${baseURL}${picture.url.S}`}}});
    }
  }
}
