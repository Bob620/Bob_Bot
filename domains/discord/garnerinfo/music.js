const ObjectCollection = require('./../../../collections/objectcollection.js');

module.exports = class {
  constructor(id = false, garnerObject = false, musicStruct = {"playlist": [], "channelName": undefined, "skip": 0}) {
    if (id && garnerObject) {
      this.id = id;
      this.garner = garnerObject;
      this.channelName = musicStruct.channelName;
      this.playlist = new ObjectCollection(musicStruct.playlist);
      this.skip = musicStruct.skip;
    } else {
      throw "Music must be created with an id and garner";
    }
  }
  update() {
    return this.garner.updateItem('id', this.id, 'music', this.getGarnerStruct());
  }
  getGarnerStruct() {
    return {
      "channelName": this.channelName,
      "playlist": this.playlist.array,
      "skip": this.skip
    }
  }
}
