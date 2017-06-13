const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  "id": "welcome"
}

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
  }

  execute() {
    console.log('Discord - Welcome');
    this.domain.server.connection.on("guildMemberAdd", (guildMember) => {
      const guild = guildMember.guild;

      this.domain.modules.dynamodbWestTwo.getItem({TableName:"bobbot", Key: {id: {S: guild.id}, type: {S: 'discord'}}}, (err, data) => {
        if (err) {
          console.log(err);
          //guild.defaultChannel.send(`Welcome to ${guild.name}, <@${guildMember.id}>`);
        } else {
          if (data.Item.welcome && data.Item.welcome.M.active.BOOL) {
            const outputString = data.Item.welcome.M.message.S.replace(/&newUser/ig, `<@${guildMember.id}>`).replace(/&serverName/ig, guild.name);
            guild.defaultChannel.send(outputString);
          }
        }
      });
      //this.domain.subDomains.text.tasks.welcome.execute({channel: guild.defaultChannel});
    });
  }

  cleanup() {

  }
}
