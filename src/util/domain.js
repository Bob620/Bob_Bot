const fs = require('fs');

/**
 * A new domain
 * @param {string} serverType The type of server to get from the bot and use as the main server
 * @param {array} [options] The server options
 */
class Domain {
  constructor(serverType=false, {requirements: requirements=[], subDomainDirectory: subDomainDirectory="", backgroundTaskDirectory: backgroundTaskDirectory=""}) {
    /**
     * The type of server to get from the bot and use as the main server
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "serverType", {
      value: serverType
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

    /**
     * The domain's required modules to get from the bot
     * @type {array}
     * @readonly
     */
    Object.defineProperty(this, "requirements", {
      value: requirements
    });

    this.subDomains = new Map();
    this.backgroundTasks = new Map();

    if (subDomainDirectory !== "") {
      fs.readdir(subDomainDirectory, (err, files) => {
        if (err) {
          throw "Unable to load subdomains";
        }
        const subDomains = this.subDomains;

        files.forEach((fileName) => {
          if (fileName.endsWith('.js')) {
            const SubDomain = require(`${subDomainDirectory}/${filename}`);
            const subDomain = new SubDomain(this);
            const subDomainId = subDomain.id;
            if (subDomains.has(subDomainId)) {
              console.trace(`WARNING: Domain has more then one SubDomain with the ID ${subDomainId}, Overwriting old SubDomain.`);
            }
            subDomains.set(subDomainId, subDomain);
          }
        });
      });
    }

    if (backgroundTaskDirectory !== "") {
      fs.readdir(backgroundTaskDirectory, (err, files) => {
        if (err) {
          throw "Unable to load ";
        }
        const backgroundTasks = this.backgroundtasks;

        files.forEach((fileName) => {
          if (fileName.endsWith('.js')) {
            const Task = require(`${backgroundTaskDirectory}/${filename}`);
            const task = new Task(this);
            const taskId = task.id;
            if (backgroundTasks.has(moduleName)) {
              console.trace(`WARNING: Domain has more then one background task with the ID ${taskId}, Overwriting old task.`);
            }
            backgroundTasks.set(taskId, task);
          }
        });
      });
    }
  }

  /**
   * Returns the requirements and server type
   * @returns {object}
   */
  requires() {
    return {"serverType": this.serverType, "requirements": this.requirements};
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
      value: info.server
    });

    /**
     * The modules provided by the bot
     * @type {object}
     * @readonly
     */
    Object.defineProperty(this, "modules", {
      value: info.requirements
    });

    /**
     * The current status of the main server
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "getStatus", {
      value: this.server.status.bind(this.server)
    });

    this.startSubDomains();
    this.startBackgroundTasks();

    if (!this.server.isReady) {
      this.server.once("ready", () => {
        this.ready();
      });
    } else {
      this.ready();
    }

    this.server.on("connect", () => {
      this.connect();
    });

    this.server.on("disconnect", () => {
      this.disconnect();
    });

    this.server.on("message", (message) => {
      this.message(message);
    });
  }

  /**
   * Starts the subDomains that have been loaded
   */
  startSubDomains() {
    this.subDomains.forEach((subDomain) => {
      subDomain.start();
    });
  }

  /**
   * Starts the background tasks that have been loaded
   */
  startBackgroundTasks() {
    this.backgroundTasks.forEach((task) => {
      task.start();
    });
  }

  /**
   * Cleans up the background tasks that have been loaded
   */
  startBackgroundTasks() {
    this.backgroundTasks.forEach((task) => {
      task.cleanup();
    });
  }
}

module.exports = Domain;
