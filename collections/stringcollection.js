module.exports = class {
  constructor(array = []) {
    this.array = array;
  }
  add(element = false) {
    if (element) {
      this.array.push(element);
    }
    return true;
  }
  delete(element = false) {
    if (element) {
      const index = this.findIndex(element);
      if (index > -1) {
        this.array.splice(index, 1);
      }
    }
    return true;
  }
  has(element = false) {
    if (element) {
      const index = this.findIndex(element);
      if (index > -1) {
        return true;
      }
    }
    return false;
  }
  findIndex(element) {
    const array = this.array;
    for (let i = 0; i < array.length; i++) {
      if (element === array[i]) {
        return i;
      }
    }
    return -1;
  }
}
