const fs = require('fs');
//const EventEmitter = require('events');

/**
 * A new domain
 * @param {string} serverType The type of server to get from the bot and use as the main server
 * @param {array} [options] The server options
 */
class Domain {
  constructor(serverType=false, {subDomainDirectory: subDomainDirectory="", backgroundTaskDirectory: backgroundTaskDirectory=""}) {
    /**
     * The type of server to get from the bot and use as the main server
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "serverType", {
      value: serverType,
      enumerable: true
    });

    /**
     * The domain's subDomain directory
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "subDomainDirectory", {
      value: subDomainDirectory
    });

    /**
     * The domain's background task directory
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "backgroundTaskDirectory", {
      value: backgroundTaskDirectory
    });

    this.subDomains = new Map();
    this.backgroundTasks = new Map();

    if (subDomainDirectory !== "") {
      const files = fs.readdirSync(subDomainDirectory);
      const subDomains = this.subDomains;

      files.forEach((filename) => {
        const SubDomain = require(`${subDomainDirectory}/${filename}/${filename}.js`);
        const subDomain = new SubDomain(this);
        const subDomainId = subDomain.id;
        if (subDomains.has(subDomainId)) {
          console.trace(`WARNING: Domain has more then one SubDomain with the ID ${subDomainId}, Overwriting old SubDomain.`);
        }
        subDomains.set(subDomainId, subDomain);
      });
    }

    if (backgroundTaskDirectory !== "") {
      const files = fs.readdirSync(backgroundTaskDirectory);
      const backgroundTasks = this.backgroundTasks;

      files.forEach((filename) => {
        if (filename.endsWith('.js')) {
          const Task = require(`${backgroundTaskDirectory}/${filename}`);
          const task = new Task(this);
          const taskId = task.id;
          if (backgroundTasks.has(taskId)) {
            console.trace(`WARNING: Domain has more then one background task with the ID ${taskId}, Overwriting old task.`);
          }
          backgroundTasks.set(taskId, task);
        }
      });
    }
  }

  /**
   * Starts the server with the requested server and modules
   * @param {object} info The server and modules needed
   */
  start(info) {
    /**
     * The main server that the domain is to connect to
     * @type {Server}
     * @readonly
     */
    Object.defineProperty(this, "server", {
      value: info.server,
      enumerable: true
    });

    /**
     * The modules provided by the bot
     * @type {object}
     * @readonly
     */
    Object.defineProperty(this, "modules", {
      value: info.modules,
      enumerable: true
    });

    /**
     * The current status of the main server
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "getStatus", {
      value: this.server.status,
      enumerable: true
    });


    if (!this.server.isReady) {
      this.server.on("connect", () => {
        console.log('Connected');
        this.startBackgroundTasks();
        this.ready();
      });
    } else {
      console.log('Connected');
      this.startBackgroundTasks();
      this.ready();
    }

    this.server.on("disconnect", () => {
      this.disconnect()
      .then(this.cleanup)
    });

    this.server.on("message", (message) => {
      this.message(message);
    });
  }

  /**
   * Cleans up the domain
   */
  cleanup() {
    this.cleanupBackgroundTasks();
    this.emit('cleaned');
  }

  /**
   * Starts the background tasks that have been loaded
   */
  startBackgroundTasks() {
    this.backgroundTasks.forEach((task) => {
      console.log(task.id);
      task.execute();
    });
  }

  /**
   * Cleans up the background tasks that have been loaded
   */
  cleanupBackgroundTasks() {
    this.backgroundTasks.forEach((task) => {
      task.cleanup();
    });
  }
}

module.exports = Domain;
