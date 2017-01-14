class Command {
    constructor({keyword: keyword = undefined, commands: commands = undefined, requires: requires = undefined}) {
        if (typeof keyword !== "string") {
            throw "keyword must be a valid string";
        } else if (keyword === "") {
            throw "keyword must be a valid string";
        } else {
            this.keyword = keyword;
        }

        if (requires !== undefined) {
            if (!Array.isArray(requires)) {
                throw "requires must be an array";
            } else {
                this.requires = requires;
            }
        } else {
            console.trace("requires is undefined, using []");
        }

        if (commands !== undefined) {
            if (!Array.isArray(commands)) {
                throw "commands must be an array";
            } else {
                this.commands = commands;
            }
        } else {
            console.trace("commands is undefined, using []");
        }
    }

    requires(dataType) {
        if (this.requires.includes(dataType)) {
            return true;
        }
        return false;
    }

    supports(message, garnerInfo) {
        const content = message.content.toLowerCase().split(' ');
        if (garnerInfo.prefix+this.keyword === content[0]) {
            return true;
        }
        return false;
    }
}

module.exports = Command;