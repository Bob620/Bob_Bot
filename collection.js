function Collection(innerArray) {
	this.array = innerArray;
	
	this.add = function(object) {
		console.log(this.array);
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
	this.exists = function(prop, value) {
		const array = this.array;
		if (propOrFn) {
			for (let i = 0; i < array.length; i++) {
				const object = array[i];
				if (object.hasOwnProperty(propOrFn)) {
					if (value) {
						if (object[propOrFn] == value) {
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
	this.find = function(propOrFn, value) {
		const array = this.array;
		if (propOrFn) {
			for (let i = 0; i < array.length; i++) {
				const object = array[i];
				if (object.hasOwnProperty(propOrFn)) {
					if (value) {
						if (typeof value === "function") {
							if (value(object[propOrFn])) {
								return object;
							}
						} else {
							if (object[propOrFn] == value) {
								return object;
							}
						}
					} else {
						return object;
					}
				}
			}
		}
		return false;
	}
	this.findAll = function(propOrFn, value) {
		const array = this.array;
		const returnCollection = new Collection();
		if (propOrFn) {
			for (let i = 0; i < array.length; i++) {
				const object = array[i];
				if (object.hasOwnProperty(propOrFn)) {
					if (value) {
						if (typeof value === "function") {
							if (value(object[propOrFn])) {
								returnCollection.add(object);;
							}
						} else {
							if (object[propOrFn] == value) {
								returnCollection.add(object);
							}
						}
					} else {
						returnCollection.add(object);
					}
				}
			}
		}
		return returnCollection;
	}
	this.first = function() {
		if (this.array[0]) {
			return this.array[0];
		}
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

module.exports = Collection;
