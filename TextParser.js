const FilterParser = require('./FilterParser.js');
const GivemeParser = require('./GivemeParser.js');
const MusicParser = require('./MusicParser.js');
const RolesParser = require('./RolesParser.js');
const DefaultParser = require('./DefaultParser.js');

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

    parse(server, message) {
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
                                FilterParser.set(server, message, tertiaryCommand);
                            }
                            break;
                        case "remove":
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                FilterParser.remove(server, message, tertiaryCommand);
                            }
                            break;
                        case "watch":
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                FilterParser.watch(server, message, tertiaryCommand);
                            }
                            break;
                        case "ignore":
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                FilterParser.ignore(server, message, tertiaryCommand);
                            }
                            break;
                        case "list":
                            FilterParser.list(server, message);
                            break;
                        default:
                            FilterParser.basicHelp(server, message);
                            break;
                    }
                    break;
                case prefix+"giveme":
                    switch(secondaryCommand) {
                        case "set":
                            if (checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                GivemeParser.set(server, message, tertiaryCommand, quaternaryCommand);
                            }
                            break;
                        case "remove":
                            if (checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                GivemeParser.remove(server, message, tertiaryCommand);
                            }
                            break;
                        case "list":
                            GivemeParser.list(server, message);
                            break;
                        default:
                            if (secondaryCommand !== false) {
                                GivemeParser.add(server, message, secondaryCommand);
                            } else {
                                GivemeParser.basicHelp(server, message);
                            }
                            break;
                    }
                    break;
                case prefix+"music":
                    switch(secondaryCommand) {
                        case "add":
                            MusicParser.add(server, message, tertiaryCommand);
                            break;
                        case "skip":
                            MusicParser.skip(server, message);
                            break;
                        case "pause":
                            MusicParser.pause(server, message);
                            break;
                        case "stop":
                            if (checkForMod(server.roles.mod.array, message.member.roles) || checkForAdmin(server.roles.admin.array, message.member.roles)) {
                                MusicParser.stop(server, message);
                            }
                            break;
                        case "list":
                            MusicParser.list(server, message);
                            break;
                        default:
                            MusicParser.basicHelp(server, message);
                            break;
                    }
                    break;
                case prefix+"roles":
                    if (checkForAdmin(server.roles.admin.array, message.member.roles)) {
                        switch(secondaryCommand) {
                            case "set":
                                switch(tertiaryCommand) {
                                    case "mod":
                                        RolesParser.setMod(server, message, quaternaryCommand);
                                        break;
                                    case "admin":
                                        RolesParser.removeMod(server, message, quaternaryCommand);
                                        break;
                                    default:
                                        RolesParser.basicHelp(server, message);
                                        break;
                                }
                                break;
                            case "remove":
                                switch(tertiaryCommand) {
                                    case "mod":
                                        RolesParser.setAdmin(server, message, quaternaryCommand);
                                        break;
                                    case "admin":
                                        RolesParser.removeAdmin(server, message, quaternaryCommand);
                                        break;
                                    default:
                                        RolesParser.basicHelp(server, message);
                                        break;
                                }
                                break;
                            case "list":
                                RolesParser.list(server, message);
                        }
                        break;
                    }
                default:
                    DefaultParser.parse(server, message);
                    break;
            }
        }
    }
}