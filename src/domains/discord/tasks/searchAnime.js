const Task = require('./../../../util/task.js');

const options = {
  "id": "searchanime",
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
    const content = message.content.toLowerCase().split(" ");
    const animeTitle = content.slice(1).join("+");

    console.log(animeTitle);

    channel.sendMessage('Searching Kitsu...').then((chatMessage) => {
      this.domain.modules.kitsu.searchAnime(animeTitle, 0).then((result) => {
        if (result.length !== 0) {
          chatMessage.edit(`I found:${result[0].attributes.titles.en_jp}\naka: ${result[0].attributes.titles.en}`);
        } else {
          chatMessage.edit('I couldn\'t find an anime with that search, try something easier ;~;');
        }
      })
      .catch((err) => {
        console.log(err);
        chatMessage.edit('An error occured >.>\nTry again later, perhaps...');
      })
    })
    .catch((err) => {
      console.log(err);
    });
  }

  help(text) {

  }
}
