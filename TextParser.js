const FilterCommands = require('./FilterCommands.js');
const GivemeCommands = require('./GivemeCommands.js');
const MusicCommands = require('./MusicCommands.js');
const RolesCommands = require('./RolesCommands.js');
const DefaultCommands = require('./DefaultCommands.js');

module.exports = class {
    constructor() {
    }

    static checkForMod(mods, roles) {
        for (let i = 0; i < mods.length; i++) {
            if (roles.has(mods[i])) {
                return true;
            }
        }
        return false;
    }

    static checkForAdmin(admins, roles) {
        for (let i = 0; i < admins.length; i++) {
            if (roles.has(admins[i])) {
                return true;
            }
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
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                FilterCommands.set(server, message, tertiaryCommand);
                            }
                            break;
                        case "remove":
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                FilterCommands.remove(server, message, tertiaryCommand);
                            }
                            break;
                        case "watch":
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                FilterCommands.watch(server, message, tertiaryCommand);
                            }
                            break;
                        case "ignore":
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
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
                            if (checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                GivemeCommands.set(server, message, tertiaryCommand, quaternaryCommand);
                            }
                            break;
                        case "remove":
                            if (checkForAdmin(server.roles.admin.array, message.member.roles)) {
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
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                MusicCommands.stop(server, message);
                            }
                            break;
                        case "list":
                            MusicCommands.list(server, message);
                            break;
                        default:
                            MusicCommands.basicHelp(server, message);
                            break;
                    }
                    break;
                case prefix+"roles":
                    if (checkForAdmin(server.roles.admin.array, message.member.roles)) {
                        switch(secondaryCommand) {
                            case "set":
                                switch(tertiaryCommand) {
                                    case "mod":
                                        RolesCommands.setMod(server, message, quaternaryCommand);
                                        break;
                                    case "admin":
                                        RolesCommands.removeMod(server, message, quaternaryCommand);
                                        break;
                                    default:
                                        RolesCommands.basicHelp(server, message);
                                        break;
                                }
                                break;
                            case "remove":
                                switch(tertiaryCommand) {
                                    case "mod":
                                        RolesCommands.setAdmin(server, message, quaternaryCommand);
                                        break;
                                    case "admin":
                                        RolesCommands.removeAdmin(server, message, quaternaryCommand);
                                        break;
                                    default:
                                        RolesCommands.basicHelp(server, message);
                                        break;
                                }
                                break;
                            case "list":
                                RolesCommands.list(server, message);
                        }
                        break;
                    }
                default:
                    DefaultCommands.parse(server, message);
                    break;
            }
        }
    }
}