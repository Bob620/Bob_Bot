const StringCollection = require('./../../../collections/stringcollection.js');

module.exports = class {
  constructor(id = false, garnerObject = false, filterStruct = {"words": [], "channels": []}) {
    if (id && garnerObject) {
      this.id = id;
      this.garner = garnerObject;
      this.words = new StringCollection(filterStruct.words);
      this.channels = new StringCollection(filterStruct.channels);
    } else {
      throw "Filter must be created with an id and garner";
    }
  }
  update() {
    return this.garner.updateItem('id', this.id, 'filter', this.getGarnerStruct());
  }
  getGarnerStruct() {
    return {
      "words": this.words.array,
      "channels": this.channels.array
    }
  }
}
