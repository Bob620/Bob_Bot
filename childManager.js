const fork = require('child_process').fork;
const Collection = require('./collection.js');

class ChildManager {
	constructor(types = [{name: "default", max: 5, file: null, args: []}]) {

		//clean up children when app is closing
		process.on('exit', this.deleteChildren);
		process.on('SIGINT', this.deleteChildren);
		process.on('uncaughtException', this.deleteChildren);

		this.types = new Collection();
		for (var i = 0; i < types.length; i++) {
			({name, file, max=5, args=[]} = types[i]);
			if (name && file) {
				this.types.add({name: name, file: file, max: max, args: args, current: 0, children: []});
			} else {
				throw "Invalid Child Type definitions when creating ChildManager";
			}
		}
	}

	static createChild(name = false, args = []) {
		return false;
	}

	static totalChildren(name = false) {
		var self = this;
		if (name) {
			return self.types.find("name", name).current;
		} else {
			return self.types.getAll("current").reduce((a, b) => a + b);
		}
	}

	static deleteChild(name = false) {
		return false;
	}

	static deleteChildren(name = false) {
		var self = this;
		if (name) {
			var child = self.types.findAll("name", name);
			self.types.delete(child);
			child.kill();
		} else {
			var types = self.types.array;
			for (let i = 0; i < types.length; i++) {
				let children = types[i].children;
				for (let x = 0; x < children; x++) {
					children[x].kill();
				}
			}
			return true;	
		}
		return false;
	}
}



class ChildManager {
	constructor() {
		this.children = new Collection();
		this.types = new Collection();
		this.childSpawner = new ChildSpawner();
	}

	static createType(typeName = false, filePath = false, {env:env = {}, max:max = 5, args:args = [], onError:onError = () => {}, onExit:onExit = () => {}, onMessage:onMessage = () => {}}) {
		if (typeName && filePath && !this.types.exists('typeName', typeName)) {
			const type = {
				typeName: typeName,
				filePath: filePath,
				env: env,
				max: max,
				args: args,
				onError: onError,
				onExit: onExit,
				onMessage: onMessage
			}

			this.types.add(type);
		}
		return false;
	}

	static deleteType(typeName = false, forceEnd = true) {
		if (typeName) {
			let children = this.children.findAll('typeName', typeName);
			if (children) {
				for (let i = 0; i < children.length; i++) {
					this.childSpawner.deleteChild(children[i]);
				}
			}
		}
		return false;
	}

	static broadcast(typeName = false, message = false) {
		if (typeName && message) {
			let children = this.children.findAll('typeName', typename);
			for (let i = 0; i < children.length; i++) {
				children[i].send(message);
			}
		}
		return false;
	}

	static getType(typeName = false) {
		if (typeName) {
			return this.types.find('typeName', typeName);
		}
		return false;
	}

	static clearChildren() {
		return new Promise((resolve, reject) => {

		});
	}

	static clearTypeChildren(typeName = false) {
		if (typeName) {
			return new Promise((resolve, reject) => {

			});
		}
		return Promise.reject();
	}

	static addChild(typeName = false, {args:args = false, env:env = false}) {
		if (typeName) {
			const type = this.types.find('typeName', typeName);
			let options = {};
			if (type) {
				if (!args) {
					args = type.args;
				}
				if (env) {
					options.env = env;
				} else {
					options.env = type.env;
				}

				const child = this.childSpawner.createChild(type.filePath, args, options);

				child.on('message' type.onMessage);

				child.on('exit' () => {
					this.clearChild(child);
					type.onExit();
				});

				child.on('error' () => {
					this.clearChild(child);
					type.onError();
				});
			}
		}
		return false;
	}
}



class ChildSpawner {
	static createChild(filePath = false, args = [], options = {}) {
		if (filePath) {
			return fork(filePath, args, options);
		}
		return false;
	}

	static deleteChild(child) {
		if (child.connected) {
			child.kill();
		}
		return true;
	}
}

module.exports = ChildManager;