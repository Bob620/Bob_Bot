/**
 * Used to make a new Task
 * @param {Domain} Domain The domain that the object can refrence
 * @param {object} [options] The optional information (id is required)
 */
class Task {
  constructor(domain, {id: id=""}) {
    if (id === "") {
      throw "All tasks must have an id";
    }

    /**
     * The domain that made this task
     * @type {Domain}
     * @readonly
     */
    Object.defineProperty(this, "domain", {
      value: domain
    });

    /**
     * The identifier of this task
     * @type {string}
     * @readonly
     */
    Object.defineProperty(this, "id", {
      value: id
    });
  }
}

module.exports = Task;
