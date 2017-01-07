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
    delete(prop, value = null) {
        if (prop) {
            const array = this.array;
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.hasOwnProperty(prop)) {
                    if (value !== null) {
                        if (element[prop] === value) {
                            array.splice(i, 1);
                            return true;
                        }
                    } else {
                        array.splice(i, 1);
                        return true;
                    }
                }
            }
        }
        return true;
    }
    getAll(prop) {
        if (prop) {
            const array = this.array;
            let output = [];
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if (element.hasOwnProperty(prop)) {
                    output.push(element[prop]);
                }
            }
            return output;
        }
        return [];
    }
    search(prop, value = null) {
        if (prop) {
            const array = this.array;
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.hasOwnProperty(prop)) {
                    if (value !== null) {
                        if (element[prop] === value) {
                            return element;
                        }
                    } else {
                        return element;
                    }
                }
            }
        }
        return false;
    }
    has(prop, value = null) {
        if (prop) {
            const array = this.array;
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.hasOwnProperty(prop)) {
                    if (value !== null) {
                        if (element[prop] === value) {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}