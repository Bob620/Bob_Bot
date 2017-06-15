const EventEmitter = require("events");

// All avalible server events
const types = {
  discord: {
    login: "login",
    connect: "ready",
    disconnect: "disconnect",
    message: "message",
    errors: [
      "error",
      "warn"
    ]
  },
  chata: {
    login: "login",
    connect: "connect",
    disconnect: "disconnect",
    message: "message",
    errors: [
      "error"
    ]
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

    // Initalization
    this.connection = connection;
    this.type = type;
    this.currentStatus = "disconnected";
    this.ready = false;
    // Select events and provides them for refrence on this
    const triggers = types[type];
    this.triggers = triggers;

    // Log all error outputting
    triggers.errors.forEach((errorTrigger) => {
      connection.on(errorTrigger, (err) => {
        console.log(err);
      });
    });

    // Create a connect listener
    connection.on(triggers.connect, () => {
      this.connected = true;
    });

    // Create a disconnect listener
    connection.on(triggers.disconnect, () => {
      this.connected = false;
    });

    // Create a message listener
    connection.on(triggers.message, (message) => {
      this.emit("message", message);
    });
  }

  login(token) {
    if (this.connection && this.connected === false) {
      this.connection[this.triggers.login](token);
    }
  }

  // Updates server correctly
  set connected(value) {
    if (value) {
      this.ready = true;
      this.emit("connect");
    } else {
      this.ready = true;
      this.emit("disconnect");
    }
  }

  // Provides the ready status
  get connected() {
    return this.ready;
  }
}

module.exports = Server;
