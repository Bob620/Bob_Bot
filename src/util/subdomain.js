const fs = require('fs');
const homeDirectory = `${__dirname}/../`;

/**
 * A new subdomain
 * @param {array} [options] The subdomain options
 */
class SubDomain {
  constructor(domain, domainDirectory, {id: id=''}) {
    if (id === '') {
      throw 'All subdomains must have an id';
    }

    /**
     * The domain that made this subdomain
     * @type {Domain}
     * @readonly
     */
    Object.defineProperty(this, 'domain', {
      value: domain,
      enumerable: true
    });

    /**
     * The identifier of this subdomain
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, 'id', {
      value: id,
      enumerable: true
    });

    this.tasks = new Map();
    const tasks = this.tasks;

    const taskURI = `${domainDirectory}/tasks`;
    const uniTaskURI = `${domainDirectory}/subdomains/${id}/tasks`;

    fs.readdir(taskURI, (err, files) => {
      if (err) {
        console.log(err);
        throw 'Unable to load Uni tasks';
      }

      files.forEach((filename) => {
        if (filename.endsWith('.js')) {
          const Task = require(`${taskURI}/${filename}`);
          const task = new Task(domain);
          const taskId = task.id;
          if (tasks.has(taskId)) {
            console.warn(`${domain.serverType}.${id} has more than one task with the ID ${taskId}, Overwriting old task.`);
          }
          tasks.set(taskId, task);
        }
      });
    });

    fs.readdir(uniTaskURI, (err, files) => {
      if (err) {
        throw 'Unable to load tasks';
      }

      files.forEach((filename) => {
        if (filename.endsWith('.js')) {
          const Task = require(`${uniTaskURI}/${filename}`);
          const task = new Task(domain);
          const taskId = task.id;
          if (tasks.has(taskId)) {
            console.warn(`${domain.serverType}.${id} has more than one task with the ID ${taskId}, Overwriting old task.`);
          }
          tasks.set(taskId, task);
        }
      });
    });
  }
}

module.exports = SubDomain;
