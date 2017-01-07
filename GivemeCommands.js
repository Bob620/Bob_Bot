module.exports = class {
    constructor() {
    }
    static set(server, message, roleName, useName) {
        const giveme = server.giveme;
        const role = message.guild.roles.find((role) => {
            if (role.name.toLowerCase() === roleName) {
                return true;
            }
            return false;
        });

        if (role !== null) {
            if (!giveme.has('name', useName)) {
                giveme.add({
                    "name": useName,
                    "id": role.id
                });
                giveme.update()
                .then(() => {
                    message.channel.sendMessage("I will provide that role.")
                    .then(() => {

                    })
                    .catch(() => {

                    });
                })
                .catch(() => {
                    message.channel.sendMessage("An error occured. Please try again later.")
                    .then(() => {

                    })
                    .catch(() => {

                    });
                })
            } else {
                message.channel.sendMessage("I will provide that role.")
                .then(() => {

                })
                .catch(() => {

                });
            }
        } else {
            message.channel.sendMessage("I was not able to find that role.")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    static remove(server, message, name) {
        const giveme = server.giveme;

        if (giveme.has('name', name)) {
            giveme.delete('name', name);
            giveme.update()
            .then(() => {
                message.channel.sendMessage("I will not provide that role.")
                .then(() => {

                })
                .catch(() => {

                });
            })
            .catch(() => {
                message.channel.sendMessage("An error occured. Please try again later.")
                .then(() => {

                })
                .catch(() => {

                });
            })
        } else {
            message.channel.sendMessage("I will not provide that role.")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    static give(server, message, name) {
        const giveme = server.giveme;
        let givemeRole = giveme.search('name', name);

        if (givemeRole && message.guild.roles.has(givemeRole.id)) {
            message.member.addRole(givemeRole.id)
            .then(() => {
                message.delete()
                .then(() => {

                })
                .catch(() => {

                });
                message.member.sendMessage("You have been given the role "+name)
                .then(() => {

                })
                .catch(() => {

                });
            })
            .catch(() => {
            });
        } else {
            message.channel.sendMessage("That is not a role I can give you.")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    static list(server, message) {
        const giveme = server.giveme.array;
        const roles = message.guild.roles;
        let output = "Giveme Roles:";

        if (giveme.length > 0) {
            for (let i = 0; i < giveme.length; i++) {
                const givemeRole = giveme[i];
                if (roles.has(givemeRole.id)) {
                    output += "\n+ "+givemeRole.name;
                } else {
                    output += "\n- "+givemeRole.name;
                }
            }
        } else {
            output += "\nNo roles are currently avalible";
        }
        output += "\n\nKey:\n+ Able to provide\n- Broken or unavalible";

        message.member.sendCode("diff", output)
        .then(() => {
            message.channel.sendMessage("<@"+message.author.id+"> , I've sent you a PM with more info.")
            .then(() => {

            })
            .catch(() => {

            });
        })
        .catch(() => {

        });
    }
    static basicHelp(server, message) {
        const prefix = server.prefix;
        message.channel.sendMessage("Use \""+prefix+"giveme [name]\" to be given a role.\n\""+prefix+"help giveme\" for more information.")
        .then(() => {

        })
        .catch(() => {
            console.log("Error sending message");
        });
    }
    static help(server, message) {
        const prefix = server.prefix;
        message.member.sendEmbed({
            "author": {
                "name": message.guild.name,
                "url": "https://discordapp.com/channels/"+message.guild.id
            },
            "thumbnail": {
                "url": message.guild.iconURL,
                "height": 400,
                "width": 400
            },
            "fields": [
                {
                    "name": prefix+"giveme set [role name] [wanted name]",
                    "value": "Adds a new role [role name] and calls it [wanted name]"
                },
                {
                    "name": prefix+"giveme remove [giveme name]",
                    "value": "Revokes the bot's ability to provide the role [giveme name]"
                },
                {
                    "name": prefix+"giveme [giveme name]",
                    "value": "Gives the person who sent the message [giveme name] role"
                },
                {
                    "name": prefix+"giveme list",
                    "value": "Displays all roles provided by the bot, shows the [wanted/giveme name]s\nSends a PM"
                }
            ],
            "color": "252525",
            "description": "----------------------",
            "title": "Giveme Help"
        })
        .then(() => {
            message.channel.sendMessage("<@"+message.author.id+"> , I've sent you a PM with more info.")
            .then(() => {

            })
            .catch(() => {

            });
        })
        .catch((err) => {
            console.log("Error sending message");
            console.log(err);
        });
    }
}