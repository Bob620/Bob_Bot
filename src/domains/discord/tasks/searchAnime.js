const Task = require('./../../../util/task.js');
const Anime = require('./../../../util/anime.js');

const options = {
  id: 'searchanime',
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  execute(message) {
    const channel = message.channel;
    const content = message.content.toLowerCase().split(' ');
    const animeTitle = content.slice(1).join('+');

    channel.send('Searching Kitsu...').then((chatMessage) => {
      this.modules.kitsu.searchAnime(animeTitle, 0).then((result) => {
        if (result.length !== 0) {
          const anime = new Anime(result[0]);

          chatMessage.edit(`I found: ${anime.title}\nEnglish: ${anime.englishTitle}\nRating: ${anime.rating}\n${anime.ageRating} - ${anime.ageGuide}\n${anime.description}`);
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
}
