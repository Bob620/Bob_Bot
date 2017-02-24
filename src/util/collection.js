/**
 * A basic collection of data
 * @param {iterable} [iterable] An iterable that can be put into the collection
 */
class collection extends Map {
  constructor(iterable) {
    super(iterable);
  }

  /**
   * Search though the collection for a specific value(use .has/.get for keys)
   * @param {function} func The function to use to search through the collection
   */
  search(func) {
    this.forEach(func);
  }
}

module.exports = collection;
