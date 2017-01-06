// DEPERCATED
const StringCollection = require('./StringCollection.js');

module.exports = class {
    constructor(id = false, garnerObject = false, roleStruct = {"mod": [], "admin": []}) {
        if (id && garnerObject) {
            this.id = id;
            this.garner = garnerObject;
            this.mod = new StringCollection(roleStruct.mod);
            this.admin = new StringCollection(roleStruct.admin);
        } else {
            throw "Roles must be created with an id and garner";
        }
    }
    update() {
        return this.garner.updateItem('id', this.id, 'roles', this.getGarnerStruct());
    }
    getGarnerStruct() {
        return {
            "mod": this.mod.array,
            "admin": this.admin.array
        }
    }
}