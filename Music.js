const ObjectCollection = require('./ObjectCollection.js');

module.exports = class {
    constructor(id = false, garnerObject = false, musicStruct = {"curentSong": null, "playlist": [], "currentType": 0, "channelId": "", "skip": 0}) {
        if (id && garnerObject) {
            this.id = id;
            this.garner = garnerObject;
            this.currentSong = musicStruct.currentSong;
            this.currentType = musicStruct.currentType;
            this.channelId = musicStruct.channelId;
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
            "currentType": this.currentType,
            "channelId": this.channelId,
            "playlist": this.playlist.array,
            "skip": this.skip
        }
    }
}