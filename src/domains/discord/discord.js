const Domain = require(`${__dirname}/../../util/domain.js`);

const serverType = 'discord';
const options = {
  domainDirectory: __dirname
};

class Discord extends Domain {
  constructor() {
    super(serverType, options);

    this.debug = {
      heartbeat: 0,
      latency: 0,
      timeout: undefined
    }
  }

  ondebug(message) {
    console.log(message);
    message = message.split(' ');

    if (this.debug.heartbeat === 0)
        if (message[4] === 'heartbeat' && message[7]) {
            this.debug.heartbeat = Number.parseInt(message[7].substring(0, message[7].length-2));
            this.debug.timeout = setTimeout(() => {
              process.exitCode = 5;
            }, this.debug.heartbeat + 10000);
        }

    if (message[2] === 'Heartbeat' && message[3] === 'acknowledged,') {
      this.debug.latency = Number.parseInt(message[6].substring(0, message[6].length-2));
      this.debug.timeout.refresh();
    }
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
