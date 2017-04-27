const Domain = require(`${__dirname}/../../util/domain.js`);

const serverType = "discord";
const options = {
  "requirements": ["random", "log", "kitsu", "flakeId", "intformat", "dynamodb", "s3", "uploadStream", "request"],
  "subDomainDirectory": `${__dirname}/subdomains`,
  "backgroundTaskDirectory": `${__dirname}/backgroundtasks`
}

class Discord extends Domain {
  constructor() {
    super(serverType, options);
  }

  ready() {
    //this.modules.log("discord", "Disconnected -> Connected");
  }

  disconnect() {
    //this.modules.log("discord", "Connected -> Disconnected");
  }

  message(message) {
    const subdomains = this.subDomains.values();
    for (let i = 0; i < this.subDomains.size; i++) {
      const subdomain = subdomains.next().value;
      if (subdomain.supports(message)) {
        subdomain.execute(message);
        break;
      }
    }
  }
}

module.exports = Discord;
