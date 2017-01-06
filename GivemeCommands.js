module.exports = class {
	constructor() {
	}
	static set(server, message, roleName, useName) {

	}
	static remove(server, message, name) {

	}
	static add(server, message, name) {
		
	}
	static list(server, message) {
		
	}
	static basicHelp(server, message) {
        const prefix = server.prefix;
        message.channel.sendMessage("Use \""+prefix+"filter\" to modify the filter. Requires Admin or higher. \n\""+prefix+"help filter\" for more information.")
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