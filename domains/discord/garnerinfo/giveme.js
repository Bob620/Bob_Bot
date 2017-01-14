const ObjectCollection = require('./../../../collections/objectcollection.js');

module.exports = class extends ObjectCollection {
    constructor(id, garnerObject, givemeStruct = []) {
        if (id && garnerObject) {
            super(givemeStruct);
            this.id = id;
            this.garner = garnerObject;
        } else {
            throw "Giveme must be created with an id and garner";
        }
    }
    update() {
        return this.garner.updateItem('id', this.id, 'giveme', this.getGarnerStruct());
    }
    getGarnerStruct() {
        return this.array;
    }
}