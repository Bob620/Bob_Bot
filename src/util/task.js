/**
 * Used to make a new Task
 * @param {Domain} Domain The domain that the object can refrence
 * @param {object} [options] The optional information (id is required)
 */
class Task {
  constructor(domain, {id: id=''}) {
    if (id === '') {
      throw 'All tasks must have an id';
    }

    /**
     * The domain that made this task
     * @type {Domain}
     * @readonly
     */
    Object.defineProperty(this, 'domain', {
      value: domain,
      enumerable: true
    });

    /**
     * Shortcut to the domain's Modules
     * @type {object}
     * @readonly
     */
    Object.defineProperty(this, 'modules', {
      value: domain.modules,
      enumerable: false
    });

    /**
     * The identifier of this task
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, 'id', {
      value: id,
      enumerable: true
    });

    /**
     * The identifier of this task
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "regex", {
      value: new RegExp(`^(?:!${id}).*`, 'i'),
      enumerable: true
    });
  }

  supports(message) {
    return new Promise((resolve, reject) => {
      if (this.regex.exec(message.cleanContent) && !message.author.bot) {
        reject(this);
      } else {
        resolve(this);
      }
    });
  }

  help(text) {
    return '';
  }
}

module.exports = Task;
