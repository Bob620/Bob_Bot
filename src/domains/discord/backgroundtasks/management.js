const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "management"
}

const delay = 60000;

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    // Define Variables

  }

  execute() {
    console.log('Discord - Management');
    const guilds = this.domain.server.connection.guilds;

    guilds.forEach((discordGuild) => {
      this.domain.modules.dynamodbWestTwo.getItem({TableName:"bobbot", Key: {id: {S: discordGuild.id}, type: {S: 'discord'}}}, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const waifuGuild = new WaifuGuild(discordGuild.id, data.Item);
          const attributify = waifuGuild.attributify();

          this.domain.modules.dynamodbWestTwo.putItem({TableName:"bobbot", Item: attributify}, (err, data) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });

    this.domain.server.connection.on('guildCreate', (discordGuild) => {
      this.domain.modules.dynamodbWestTwo.getItem({TableName:"bobbot", Key: {id: {S: discordGuild.id}, type: {S: 'discord'}}}, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const waifuGuild = new WaifuGuild(discordGuild.id, data.Item);
          const attributify = waifuGuild.attributify();

          this.domain.modules.dynamodbWestTwo.putItem({TableName:"bobbot", Item: attributify}, (err, data) => {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    });
  }

  cleanup() {

  }
}

class WaifuGuild {
  constructor(guildId, discordGuild = {}) {
    this.id = guildId;
    this.type = "discord";

    this.welcome = {
      active: discordGuild.welcome ? discordGuild.welcome.M.active.BOOL : false,
      message: discordGuild.welcome ? discordGuild.welcome.M.message.S : "Welcome to $guild"
    }
  }

  attributify() {
    return {
      id: {S: this.id},
      type: {S: this.type},
      welcome: {M: {
        active: {BOOL: this.welcome.active},
        message: {S: this.welcome.message}
      }}
    }
  }
}
