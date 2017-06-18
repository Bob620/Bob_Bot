const Task = require('./../../../../../util/task.js');
const fs = require('fs');

const options = {
  id: 'picupload',
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
    if (message.author.id == '69096215068811264') { // My userID, change later
      const content = message.content.toLowerCase().split("|");
      if (content[1]) {
        const tags = content[1].split(',');
        if (content[2]) {
          let ext = content[2].split('.');
          ext = ext[ext.length-1].toLowerCase();
          if (ext === 'png' || ext === 'jpg' || ext === 'gif') {
            const modules = this.domain.modules;

            message.reply('Hold on, grabbing the image...').then((sentMessage) => {
              const uid = modules.intformat(modules.flakeId.next(), 'dec');

              modules.request(content[2].trim())
              .on('error', (err) => {
                console.log(err);
                message.reply('I wasn\'t able to download that image.');
              })
              .on('response', (response) => {
                console.log(response);
                if (response.statusCode !== 200)
                  response.destroy(response.statusCode);
              })
              .pipe(modules.uploadStream(modules.s3, {Bucket: 'i.bobco.moe', Key: `${uid}.${ext}`, ACL: 'public-read'}))
              .on('finish', () => {
                message.reply('I found the image, uploading with your tags now...')
                .then(() => {
                  let tagList = [];

                  for (let i = 0; i < tags.length; i++) {
                    const tag = tags[i];
                    tagList.push(tag.trim().toLowerCase());
                  }

                  const item = {
                    uid: {S: uid},
                    tags: {SS: tagList},
                    url: {S: `${uid}.${ext}`}
                  }

                  modules.dynamodbWestTwo.putItem({
                    Item: item,
                    TableName: 'picturebase'
                  }, (err, data) => {
                    if (err) {
                      console.log(err);
                      message.reply('An error occured! Abort!');
                    } else {
                      message.reply(`The image was uploaded successfully. UID: ${uid}`);
                    }
                  });
                })
                .catch(() => {})
              });
            })
            .catch((err) => {
              console.log(err);
            });
          }
        } else {
          //message.reply('Hold on, grabbing the last uploaded image...').then(() => {
          //  message.reply('I found the image, uploading with your tags now...');
          //});
          message.reply("NOPE!");
        }
      }
    }
  }

  help(text) {

  }
}
