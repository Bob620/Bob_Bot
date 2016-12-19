class Collection {
	constructor(innerArray = []) {
		this.array = innerArray;
	}
	static add(object) {
		if (object) {
			this.array.push(object);
		}
	}
	static delete(object) {
		if (object) {
			let index = this.array.indexOf(object);
			if (index) {
				this.array.splice(index, 1);
			}
		}
	}
	static exists(prop, value) {
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
	static find(propOrFn, value) {
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
	static findAll(propOrFn, value) {
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
	static first() {
		if (this.array[0]) {
			return this.array[0];
		}
	}
	static getAll(prop) {
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
	static some(func) {
		if (func) {
			return this.array.some(func);
		}
		return false;
	}
}

module.exports = Collection;