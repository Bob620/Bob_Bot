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
      guild.defaultChannel.send(`Welcome to ${guild.name}, <@${guildMember.id}>`);

      //this.domain.subDomains.text.tasks.welcome.execute({channel: guild.defaultChannel});
    });
  }

  cleanup() {

  }
}
