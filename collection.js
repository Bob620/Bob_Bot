module.exports = function Collection(innerArray = []) {
    this.array = innerArray;

    this.add = function(object) {
        if (object) {
            this.array.push(object);
        }
    }

    this.delete = function(propOrFn, value) {
        const array = this.array;
        if (propOrFn && value) {
            for (let i = 0; i < array.length; i++) {
                const object = array[i];
                if (object.hasOwnProperty(propOrFn)) {
                    if (value) {
                        if (typeof value === "function") {
                            if (value(object[propOrFn])) {
                                array.splice(i, 1);
                                return true;
                            }
                        } else {
                            if (object[propOrFn] == value) {
                                array.splice(i, 1);
                                return true;
            	            }
            	        }
            	    }
            	}
            }
        }
        return false;
    }

    this.exists = function(propOrFn, value) {
        if (prop) {
            const array = this.array;
            for (let i = 0; i < array.length; i++) {
                const item = search(propOrFn, value, array[i]);
                if (item) {
                    return true;
                }
            }
        }
        return false;
    }

    this.find = function(propOrFn, value) {
        if (propOrFn) {
            const array = this.array;
            for (let i = 0; i < array.length; i++) {
                const item = search(propOrFn, value, array[i]);
                if (item) {
                    return item;
                }
            }
        }
        return false;
    }

    this.findAll = function(propOrFn, value) {
        const returnCollection = new Collection();
        if (propOrFn) {
            const array = this.array;
            for (let i = 0; i < array.length; i++) {
                const item = search(propOrFn, value, array[i]);
                if (item) {
                    returnCollection.add(item);
                }
            }
        }
        return returnCollection;
    }

    this.first = function() {
        if (this.array[0]) {
            return this.array[0];
        }
        return false;
    }

    this.getAll = function(prop) {
        if (prop) {
            const array = this.array;
            let keys = [];
            for (i = 0; i < array.length; i++) {
                const key = array[i][prop];
                if (key) {
                    keys.push(key);
                }
            }
            return keys;
        }
        return [];
    }

    this.some = function(func) {
        if (func) {
            return this.array.some(func);
        }
        return false;
    }
}

function search(propOrFn = true, value = true, item = {}) {
    if (item.hasOwnProperty(propOrFn)) {
        if (value) {
            if (typeof value === "function") {
                if (value(item[propOrFn])) {
                    return item;
                }
            } else {
                if (item[propOrFn] == value) {
                    return item;
                }
            }
        } else {
            return item;
        }
    }
    return false;
}
