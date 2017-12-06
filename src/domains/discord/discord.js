const Domain = require(`${__dirname}/../../util/domain.js`);

const serverType = 'discord';
const options = {
  domainDirectory: __dirname
}

class Discord extends Domain {
  constructor() {
    super(serverType, options);
  }

  ready() {
    console.log('Discord | Disconnected -> Connected');
    //this.modules.log("discord", "Disconnected -> Connected");
  }

  async disconnect() {
    console.log('Discord | Connected -> Disconnected');
    //this.modules.log("discord", "Connected -> Disconnected");
    return true;
  }

  async message(message) {
    let subdomains = [];
    this.subDomains.forEach((subdomain) => {
      subdomains.push(subdomain.supports(message));
    });

    Promise.all(subdomains)
    .then(() => {})
    .catch((subdomain) => {
      subdomain.execute(message);
    });
  }
}

module.exports = Discord;
