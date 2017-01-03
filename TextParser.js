const Server = require('./Server.js');

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
        const filterParser = new FilterParser(server, message);
        const givemeParser = new GivemeParser(server, message);
        const musicParser = new MusicParser(server, message);
        const rolesParser = new RolesParser(server, message);
        const defaultParser = new DefaultParser(server, message);

        const splitContent = message.content.split(' ');
        const [primaryCommand = false, secondaryCommand = false, tertiaryCommand = false, quaternaryCommand = false] = splitContent;
        const prefix = server.prefix;
        const sendMessage = message.channel.sendMessage.bind(message.channel);

        if (primaryCommand) {
            switch(primaryCommand) {
                case prefix+"filter":
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
                    defaultParser.parse();
                    break;
            }
        }
    });
}