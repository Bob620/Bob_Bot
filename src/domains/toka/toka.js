const Domain = require(`${__dirname}/../../util/domain.js`);

const serverType = 'toka';
const options = {
  domainDirectory: __dirname,
}

class Toka extends Domain {
  constructor() {
    super(serverType, options);
  }

  ready() {
    console.log('Toka | Disconnected -> Connected');
    this.server.connection.join('toka');
    //this.modules.log("Toka", "Disconnected -> Connected");
  }

  async disconnect() {
    console.log('Toka | Connected -> Disconnected');
    //this.modules.log("Toka", "Connected -> Disconnected");
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

module.exports = Toka;
