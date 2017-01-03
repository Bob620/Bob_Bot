const Server = require('./Server.js');
const FilterParser = require('./FilterParser.js');
const GivemeParser = require('./GivemeParser.js');
const MusicParser = require('./MusicParser.js');
const RolesParser = require('./RolesParser.js');
const DefaultParser = require('./DefaultParser.js');

module.exports = function(garnerObject, message) {
    const server = new Server(message.guild.id, garnerObject);

    const checkForMod = (roles) => {
        const mods = server.roles.mod.array;
        for (let i = 0; i < mods.length; i++) {
            if (roles.has(mods[i])) {
                return true;
            }
        }
        return false;
    }

    const checkForAdmin = (roles) => {
        const admins = server.roles.admin.array;
        for (let i = 0; i < admins.length; i++) {
            if (roles.has(admins[i])) {
                return true;
            }
        }
        return false;
    }

    server.populate()
    .then((newServer) => {
        const [primaryCommand = false, secondaryCommand = false, tertiaryCommand = false, quaternaryCommand = false] = message.content.split(' ');
        const prefix = server.prefix;

        if (primaryCommand) {
            switch(primaryCommand) {
                case prefix+"filter":
                    const filterParser = new FilterParser(server, message);
                    switch(secondaryCommand) {
                        case "set":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                filterParser.set(tertiaryCommand);
                            }
                            break;
                        case "remove":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                filterParser.remove(tertiaryCommand);
                            }
                            break;
                        case "watch":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                filterParser.watch(tertiaryCommand);
                            }
                            break;
                        case "ignore":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                filterParser.ignore(tertiaryCommand);
                            }
                            break;
                        case "list":
                            filterParser.list(tertiaryCommand);
                            break;
                        default:
                            filterParser.basicHelp();
                            break;
                    }
                    break;
                case prefix+"giveme":
                    const givemeParser = new GivemeParser(server, message);
                    switch(secondaryCommand) {
                        case "set":
                            if (checkForAdmin(message.member.roles)) {
                                givemeParser.set(tertiaryCommand, quaternaryCommand);
                            }
                            break;
                        case "remove":
                            if (checkForAdmin(message.member.roles)) {
                                givemeParser.remove(tertiaryCommand);
                            }
                            break;
                        case "list":
                            givemeParser.list();
                            break;
                        default:
                            if (secondaryCommand !== false) {
                                givemeParser.add(secondaryCommand);
                            } else {
                                givemeParser.basicHelp();
                            }
                            break;
                    }
                    break;
                case prefix+"music":
                    const musicParser = new MusicParser(server, message);
                    switch(secondaryCommand) {
                        case "add":
                            musicParser.add(tertiaryCommand);
                            break;
                        case "skip":
                            musicParser.skip();
                            break;
                        case "pause":
                            musicParser.pause();
                            break;
                        case "stop":
                            if (checkForMod(message.member.roles) || checkForAdmin(message.member.roles)) {
                                musicParser.stop();
                            }
                            break;
                        case "list":
                            musicParser.list();
                            break;
                        default:
                            musicParser.basicHelp();
                            break;
                    }
                    break;
                case prefix+"roles":
                    if (checkForAdmin(message.member.roles)) {
                        const rolesParser = new RolesParser(server, message);
                        switch(secondaryCommand) {
                            case "set":
                                switch(tertiaryCommand) {
                                    case "mod":
                                        rolesParser.setMod(quaternaryCommand);
                                        break;
                                    case "admin":
                                        rolesParser.removeMod(quaternaryCommand);
                                        break;
                                    default:
                                        rolesParser.basicHelp();
                                        break;
                                }
                                break;
                            case "remove":
                                switch(tertiaryCommand) {
                                    case "mod":
                                        rolesParser.setAdmin(quaternaryCommand);
                                        break;
                                    case "admin":
                                        rolesParser.removeAdmin(quaternaryCommand);
                                        break;
                                    default:
                                        rolesParser.basicHelp();
                                        break;
                                }
                                break;
                            case "list":
                                rolesParser.list();
                        }
                        break;
                    }
                default:
                    const defaultParser = new DefaultParser(server, message);
                    defaultParser.parse();
                    break;
            }
        }
    });
}