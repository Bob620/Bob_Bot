const fs = require('fs');

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
      value: domain
    });
    /**
     * The identifier of this subdomain
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "id", {
      value: id
    });
    /**
     * The subdomains's task directory
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "taskDirectory", {
      value: taskDirectory
    });

    this.tasks = new Map();

    if (taskDirectory !== "") {
      fs.readdir(taskDirectory, (err, files) => {
        if (err) {
          throw "Unable to load tasks";
        }
        const tasks = this.tasks;

        files.forEach((fileName) => {
          if (fileName.endsWith('.js')) {
            const Task = require(`${taskDirectory}/${filename}`);
            const task = new Task(this);
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
