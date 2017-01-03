const Filter = require('./Filter.js');
const Giveme = require('./Giveme.js');
const Music = require('./Music.js');
const Roles = require('./Roles.js');

module.exports = class {
    constructor(id = false, garnerObject = false) {
        if (id && garnerObject) {
            this.id = id;
            this.garner = garnerObject;
            this.prefix = null;
            this.filter = null;
            this.giveme = null;
            this.music = null;
            this.roles = null;
        } else {
            throw "Filter must be created with an id and garner";
        }
    }
    populate() {
        garnerObject.searchFor('id', id, 1)
        .then((garnerList) => {
            if (garnerList.length > 0) {
                return garnerList[0];
            }
            return false;
        });
        .then((garnerStruct) => {
            if (garnerStruct) {
                this.filter = new Filter(id, garnerObject, garnerStruct.filter);
                this.giveme = new Giveme(id, garnerObject, garnerStruct.giveme);
                this.music = new Music(id, garnerObject, garnerStruct.music);
                this.roles = new Roles(id, garnerObject, garnerStruct.roles);
                this.prefix = garnerStruct.prefix;
                return false;
            } else {
                this.filter = new Filter(id, garnerObject);
                this.giveme = new Giveme(id, garnerObject);
                this.music = new Music(id, garnerObject);
                this.roles = new Roles(id, garnerObject);
                this.prefix = "!";
                return true;
            }
        })
        .catch((err) => {
            this.filter = new Filter(id, garnerObject);
            this.giveme = new Giveme(id, garnerObject);
            this.music = new Music(id, garnerObject);
            this.roles = new Roles(id, garnerObject);
            this.prefix = "!";
            return true;
        });
    }
    update() {
        let garnerStruct = this.getGarnerStruct();
        let id = this.id;
        let garner = this.garner;
        return garner.updateItem('id', id, 'filter', garnerStruct.filter);
        return garner.updateItem('id', id, 'giveme', garnerStruct.giveme);
        return garner.updateItem('id', id, 'music', garnerStruct.music);
        return garner.updateItem('id', id, 'roles', garnerStruct.roles);
        return garner.updateItem('id', id, 'prefix', garnerStruct.prefix);
    }
    getGarnerStruct() {
        return {
            "filter": this.filter.getGarnerStruct(),
            "giveme": this.giveme.getGarnerStruct(),
            "music": this.music.getGarnerStruct(),
            "roles": this.roles.getGarnerStruct(),
            "prefix": this.prefix
        }
    }
    get prefix() {
        return this.prefix;
    }
    set prefix(prefix = '!') {
        this.garner.updateItem('id', this.id, 'prefix', prefix)
        .then(() => {
            this.prefix = prefix;
        })
        .catch(() => {
        });
    }
}
