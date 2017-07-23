const fs = require('fs');
//const EventEmitter = require('events');

/**
 * A new domain
 * @param {string} serverType The type of server to get from the bot and use as the main server
 * @param {array} [options] The server options
 */
class Domain {
  constructor(serverType=false, {domainDirectory: domainDirectory=false}) {
    if (!domainDirectory) {
      throw 'Domain directory is required';
    }

    /**
     * The type of server to get from the bot and use as the main server
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, 'serverType', {
      value: serverType,
      enumerable: true
    });

    this.subDomains = new Map();
    this.backgroundTasks = new Map();

    const subDomains = this.subDomains;
    const backgroundTasks = this.backgroundTasks;

    const subdomainURI = `${domainDirectory}/subdomains`;
    const backgroundTasksURI = `${domainDirectory}/backgroundtasks`;

    const subdomainFolder = fs.readdirSync(subdomainURI);
    const backgroundTasksFolder = fs.readdirSync(backgroundTasksURI);

    subdomainFolder.forEach((filename) => {
      const SubDomain = require(`${subdomainURI}/${filename}/${filename}.js`);
      const subDomain = new SubDomain(this, domainDirectory);
      const subDomainId = subDomain.id;
      if (subDomains.has(subDomainId)) {
        console.warn(`${this.serverType} has more then one SubDomain with the ID ${subDomainId}, Overwriting old SubDomain.`);
      }
      subDomains.set(subDomainId, subDomain);
    });

    backgroundTasksFolder.forEach((filename) => {
      if (filename.endsWith('.js')) {
        const Task = require(`${backgroundTasksURI}/${filename}`);
        const task = new Task(this);
        const taskId = task.id;
        if (backgroundTasks.has(taskId)) {
          console.warn(`${this.serverType} has more then one background task with the ID ${taskId}, Overwriting old task.`);
        }
        backgroundTasks.set(taskId, task);
      }
    });
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
    Object.defineProperty(this, 'server', {
      value: info.server,
      enumerable: true
    });

    /**
     * The modules provided by the bot
     * @type {object}
     * @readonly
     */
    Object.defineProperty(this, 'modules', {
      value: info.modules,
      enumerable: true
    });

    if (!this.server.connected) {
      this.server.once('connect', () => {
        this.startBackgroundTasks();
        this.ready();
      });
    } else {
      this.startBackgroundTasks();
      this.ready();
    }

    this.server.on('disconnect', () => {
      this.disconnect()
      .then(this.cleanupBackgroundTasks.apply(this));
    });

    this.server.on('message', (message) => {
      new Promise(() => {
        this.message(message);
      });
    });
  }

  /**
   * Cleans up the domain
   */
//  cleanup() {
//    return new Promise((resolve, reject) => {
//      resolve(this.cleanupBackgroundTasks());
//    });
//    this.cleanupBackgroundTasks();
//  }

  /**
   * "Restarts" a domain
   */
//  restart() {
//
//  }

  /**
   * Starts the background tasks that have been loaded
   */
  startBackgroundTasks() {
    this.backgroundTasks.forEach((task) => {
      task.execute();
    });
  }

  /**
   * Cleans up the background tasks that have been loaded
   */
  cleanupBackgroundTasks() {
    this.backgroundTasks.forEach((task) => {
      if (task.cleanup) {
        task.cleanup();
      } else {
        console.warn(`${task.id} does not have a cleanup function in the domain ${self.serverType}`);
      }
    });
  }
}

module.exports = Domain;
