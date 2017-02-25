const EventEmitter = require('events');

const types = {
  "discord": {
    "connect": "ready",
    "disconnect": "disconnect",
    "message": "message"
  },
  "chata": {
    "connect": "connect",
    "disconnect": "disconnect",
    "message": "message"
  }
}

/**
 * A universal server event emitter to handle any top-back-end for the server, currently supports "chata" and "discord"
 * @param {string} type The type of connection to handle
 * @param {Object} connection The connection to use
 * @example
 * const discord = new Server(new Discord.Client());
 */
class Server extends EventEmitter {
  constructor(type, connection) {
    super();

    this.connection = connection;
    this.type = type;
    this.currentStatus = "disconnected";
    this.isReady = false;

    const events = types[type];

    this.events = events;

    connection.on(events.connect, () => {
      this.currentStatus = "connected";
      this.isReady = true;
      this.emit("connect");
    });

    connection.on(events.disconnect, () => {
      this.currentStatus = "disconnected";
      this.isReady = false;
      this.emit("disconnect");
    });

    connection.on(events.message, (message) => {
      this.emit("message", message);
    });
  }

  get status() {
    return this.currentStatus;
  }
}

module.exports = Server;
