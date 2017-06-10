const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "counter"
}

const delay = 60000;

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  execute() {
/*    console.log('Discord - Counter');
    const guilds = this.domain.server.connection.guilds;
    let test = 0;

    guilds.forEach((discordGuild) => {
      if (test != 1) {
        test = 1;
        this.domain.modules.dynamodbWestTwo.getItem({TableName:"bobbot", Key: {id: {S: discordGuild.id}, type: {S: 'discord'}}}, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            let guild = new WaifuGuild(data.Item);

            this.domain.subDomains.get("text").tasks.forEach((value, taskId) => {
              if (guild.counter.find((counterTask) => {
                return counterTask.id === taskId;
              }) === undefined) {
                guild.counter.push({id: taskId, total: 0});
              }
            });

            const counter = guild.attributify().counter;

            for (let i = 0; i < counter.L.length; i++) {
              console.log(counter.L[i].M);
            }

//            this.domain.modules.dynamodbWestTwo.putItem({TableName:"bobbot", Item: guild}, (err, data) => {
//              if (err) {
//                console.log(err);
//              }
//            });
          }
        });
      }
    });

    this.domain.server.connection.on('guildCreate', (discordGuild) => {
      this.domain.modules.dynamodbWestTwo.getItem({TableName:"bobbot", Key: {id: {S: discordGuild.id}, type: {S: 'discord'}}}, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          let guild = new WaifuGuild(data.Item);

          this.domain.subDomains.get("text").tasks.forEach((value, taskId) => {
            if (guild.counter.find((counterTask) => {
              return counterTask.id === taskId;
            }) === undefined) {
              guild.counter.push({id: taskId, total: 0});
            }
          });

//          this.domain.modules.dynamodbWestTwo.putItem({TableName:"bobbot", Item: guild}, (err, data) => {
//            if (err) {
//              console.log(err);
//            }
//          });
        }
      });
    });
  }

  update(guildId, taskId) {
    this.domain.modules.dynamodbWestTwo.getItem({TableName:"bobbot", Key: {id: {S: guildId}, type: {S: 'discord'}}}, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let guild = new WaifuGuild(data.Item);

        let task = guild.counter.find((task) => {
          return task.id === taskId;
        });

        task.total++;

//        this.domain.modules.dynamodbWestTwo.putItem({TableName:"bobbot", Item: guild}, (err, data) => {
//          if (err) {
//            console.log(err);
//          }
//        });
      }
    });*/
  }

  cleanup() {

  }
}

class WaifuGuild {
  constructor(guildId, discordGuild = {}) {
    this.id = guildId;
    this.type = "discord";

    this.counter = [];
  }

  attributify() {
    let attributes = {
      id: {S: this.id},
      type: {S: this.type},
      counter: {L: []}
    }

    this.counter.forEach((item) => {
      attributes.counter.L.push({M: {id: {S: item.id}, total: {N: item.total}}});
    });

    return attributes;
  }
}
