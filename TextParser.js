const FilterCommands = require('./FilterCommands.js');
const GivemeCommands = require('./GivemeCommands.js');
const MusicCommands = require('./MusicCommands.js');
const RolesCommands = require('./RolesCommands.js');
const PrefixCommands = require('./PrefixCommands.js');
const GeneralCommands = require('./GeneralCommands.js');
const DefaultCommands = require('./DefaultCommands.js');

module.exports = class {
    constructor() {
    }

    static checkForMod(roles) {
        if (roles.find((role) => {
            if (role.name.toLowerCase() === 'perm.mod') {
                return true;
            }
        })) {
            return true;
        }
        return false;
    }

    static checkForAdmin(roles) {
        if (roles.find((role) => {
            if (role.name.toLowerCase() === 'perm.admin') {
                return true;
            }
        })) {
            return true;
        }
        return false;
    }

    static parse(server, message) {
        const [primaryCommand = false, secondaryCommand = false, tertiaryCommand = false, quaternaryCommand = false] = message.content.toLowerCase().split(' ');
        const prefix = server.prefix;
        const checkForAdmin = this.checkForAdmin;
        const checkForMod = this.checkForMod;

        if (primaryCommand) {
            switch(primaryCommand) {
                case prefix+"filter":
                    switch(secondaryCommand) {
                        case "set":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                FilterCommands.set(server, message, tertiaryCommand);
                            }
                            break;
                        case "remove":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                FilterCommands.remove(server, message, tertiaryCommand);
                            }
                            break;
                        case "watch":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                FilterCommands.watch(server, message, tertiaryCommand);
                            }
                            break;
                        case "ignore":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                FilterCommands.ignore(server, message, tertiaryCommand);
                            }
                            break;
                        case "list":
                            FilterCommands.list(server, message);
                            break;
                        default:
                            FilterCommands.basicHelp(server, message);
                            break;
                    }
                    break;
                case prefix+"giveme":
                    switch(secondaryCommand) {
                        case "set":
                            if (checkForAdmin(message.member.roles)) {
                                GivemeCommands.set(server, message, tertiaryCommand, quaternaryCommand);
                            }
                            break;
                        case "remove":
                            if (checkForAdmin(message.member.roles)) {
                                GivemeCommands.remove(server, message, tertiaryCommand);
                            }
                            break;
                        case "list":
                            GivemeCommands.list(server, message);
                            break;
                        default:
                            if (secondaryCommand !== false) {
                                GivemeCommands.add(server, message, secondaryCommand);
                            } else {
                                GivemeCommands.basicHelp(server, message);
                            }
                            break;
                    }
                    break;
                case prefix+"music":
                    switch(secondaryCommand) {
                        case "add":
                            MusicCommands.add(server, message, tertiaryCommand);
                            break;
                        case "skip":
                            MusicCommands.skip(server, message);
                            break;
                        case "pause":
                            MusicCommands.pause(server, message);
                            break;
                        case "stop":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                MusicCommands.stop(server, message);
                            }
                            break;
                        case "join":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                MusicCommands.join(server, message, tertiaryCommand);
                            }
                            break;
                        case "leave":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                MusicCommands.leave(server, message, tertiaryCommand);
                            }
                            break;
                        case "playlist":
                            MusicCommands.playlist(server, message);
                            break;
                        default:
                            MusicCommands.basicHelp(server, message);
                            break;
                    }
                    break;
                case prefix+"help":
                    switch(secondaryCommand) {
                        case "filter":
                            FilterCommands.help(server, message);
                            break;
                        case "giveme":
                            GivemeCommands.help(server, message);
                            break;
                        case "music":
                            MusicCommands.help(server, message);
                            break;
                        case "roles":
                            RolesCommands.help(server, message);
                            break;
                        case "commands":
                            GeneralCommands.help(server, message);
                            break;
                        case "prefix":
                            DefaultCommands.help(server, message);
                        default:
                            DefaultCommands.help(server, message);
                            break;
                    }
                case prefix+"roles":
                    RolesCommands.basicHelp(server, message);
                    break;
                case prefix+"prefix":
                    if (secondaryCommand) {
                        PrefixCommands.parse(server, message, secondaryCommand);
                    } else {
                        PrefixCommands.basicHelp(server, message);
                    }
                    break;
                default:
                    switch(primaryCommand) {
                        case prefix+"flip":
                            GeneralCommands.flip(server, message);
                            break;
                        case prefix+"nsfw":
                            GeneralCommands.nsfw(server, message);
                            break;
                        default:
                            DefaultCommands.parse(server, message);
                            break;
                    }
                    break;
            }
        }
    }
}