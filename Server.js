const Filter = require('./Filter.js');
const Giveme = require('./Giveme.js');
const Music = require('./Music.js');

module.exports = class {
    constructor(id = false, garnerObject = false) {
        if (id && garnerObject) {
            this.id = id;
            this.garner = garnerObject;
            this.prefixSymbol = null;
            this.filter = null;
            this.giveme = null;
            this.music = null;
        } else {
            throw "Filter must be created with an id and garner";
        }
    }
    populate() {
        const garner = this.garner;
        const id = this.id;
        return garner.searchFor('id', id, 1)
        .then((garnerList) => {
            if (garnerList.length > 0) {
                return garnerList[0];
            }
            return false;
        })
        .then((garnerStruct) => {
            if (garnerStruct) {
                this.filter = new Filter(id, garner, garnerStruct.filter);
                this.giveme = new Giveme(id, garner, garnerStruct.giveme);
                this.music = new Music(id, garner, garnerStruct.music);
                this.prefixSymbol = garnerStruct.prefix;
                return Promise.resolve(false);
            } else {
                return new Promise((resolve, reject) => {
                    this.filter = new Filter(id, garner);
                    this.giveme = new Giveme(id, garner);
                    this.music = new Music(id, garner);
                    this.prefixSymbol = '!';
                    this.submit()
                    .then(() => {
                        resolve(true);
                    })
                    .catch(() => {
                        reject(true);
                    });
                });
            }
        })
        .catch((err) => {
            return new Promise((resolve, reject) => {
                this.filter = new Filter(id, garner);
                this.giveme = new Giveme(id, garner);
                this.music = new Music(id, garner);
                this.prefixSymbol = '!';
                this.submit()
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    reject(true);
                });
            });
        });
    }
    submit() {
        return this.garner.upload(this.getGarnerStruct());
    }
    update() {
        return new Promise((resolve, reject) => {
            let garnerStruct = this.getGarnerStruct();
            let id = this.id;
            let garner = this.garner;

            garner.updateItem('id', id, 'filter', garnerStruct.filter)
            .then(() => {

            })
            .catch(() => {

            });
            garner.updateItem('id', id, 'giveme', garnerStruct.giveme)
            .then(() => {

            })
            .catch(() => {

            });
            garner.updateItem('id', id, 'music', garnerStruct.music)
            .then(() => {

            })
            .catch(() => {

            });
            garner.updateItem('id', id, 'roles', garnerStruct.roles)
            .then(() => {

            })
            .catch(() => {

            });
            garner.updateItem('id', id, 'prefix', garnerStruct.prefix)
            .then(() => {

            })
            .catch(() => {

            });
            resolve();
        });
    }
    getGarnerStruct() {
        return {
            "id": this.id,
            "filter": this.filter.getGarnerStruct(),
            "giveme": this.giveme.getGarnerStruct(),
            "music": this.music.getGarnerStruct(),
            "prefix": this.prefix
        }
    }
    get prefix() {
        return this.prefixSymbol;
    }
    set prefix(prefix) {
        this.garner.updateItem('id', this.id, 'prefix', prefix)
        .then(() => {
            this.prefixSymbol = prefix;
        })
        .catch((err) => {
            console.log(err);
        });
    }
}
