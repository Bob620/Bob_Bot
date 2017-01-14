const ObjectCollection = require('./../../../collections/objectcollection.js');

module.exports = class {
    constructor(id = false, garnerObject = false, musicStruct = {"curentSong": undefined, "playlist": [], "currentTime": 0, "channelName": undefined, "skip": 0}) {
        if (id && garnerObject) {
            this.id = id;
            this.garner = garnerObject;
            this.currentSong = musicStruct.currentSong;
            this.currentTime = musicStruct.currentTime;
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
            "currentSong": this.currentSong,
            "currentTime": this.currentTime,
            "channelName": this.channelName,
            "playlist": this.playlist.array,
            "skip": this.skip
        }
    }
}