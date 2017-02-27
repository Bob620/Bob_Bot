const fs = require('fs');

const homeDirectory = `${__dirname}/../`;

/**
 * A new subdomain
 * @param {array} [options] The subdomain options
 */
class SubDomain {
  constructor(domain, {id: id="", taskDirectory: taskDirectory=""}) {
    if (id === "") {
      throw "All subdomains must have an id";
    }

    /**
     * The domain that made this subdomain
     * @type {Domain}
     * @readonly
     */
    Object.defineProperty(this, "domain", {
      value: domain,
      enumerable: true
    });
    /**
     * The identifier of this subdomain
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "id", {
      value: id,
      enumerable: true
    });
    /**
     * The subdomains's task directory
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "taskDirectory", {
      value: taskDirectory
    });
    /**
     * The subdomains's uniTask directory
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "uniTaskDirectory", {
      value: `${homeDirectory}/domains/${domain.serverType}/tasks`
    });


    this.tasks = new Map();

    const uniTaskDirectory = this.uniTaskDirectory;

    if (uniTaskDirectory !== "") {
      fs.readdir(uniTaskDirectory, (err, files) => {
        if (err) {
          console.log(err);
          throw "Unable to load Uni tasks";
        }
        const tasks = this.tasks;

        files.forEach((filename) => {
          if (filename.endsWith('.js')) {
            const Task = require(`${uniTaskDirectory}/${filename}`);
            const task = new Task(this.domain);
            const taskId = task.id;
            if (tasks.has(taskId)) {
              console.trace(`WARNING: SubDomain has more then one task with the ID ${taskId}, Overwriting old task.`);
            }
            tasks.set(taskId, task);
          }
        });
      });
    }

    if (taskDirectory !== "") {
      fs.readdir(taskDirectory, (err, files) => {
        if (err) {
          throw "Unable to load tasks";
        }
        const tasks = this.tasks;

        files.forEach((filename) => {
          if (filename.endsWith('.js')) {
            const Task = require(`${taskDirectory}/${filename}`);
            const task = new Task(this.domain);
            const taskId = task.id;
            if (tasks.has(taskId)) {
              console.trace(`WARNING: SubDomain has more then one task with the ID ${taskId}, Overwriting old task.`);
            }
            tasks.set(taskId, task);
          }
        });
      });
    }
  }
}

module.exports = SubDomain;
