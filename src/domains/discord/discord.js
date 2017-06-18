const Domain = require(`${__dirname}/../../util/domain.js`);

const serverType = 'discord';
const options = {
  domainDirectory: __dirname,
}

class Discord extends Domain {
  constructor() {
    super(serverType, options);
  }

  ready() {
    console.log('Discord | Disconnected -> Connected');
    //this.modules.log("discord", "Disconnected -> Connected");
  }

  disconnect() {
    console.log('Discord | Connected -> Disconnected');
    //this.modules.log("discord", "Connected -> Disconnected");
    return true;
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
