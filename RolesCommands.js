module.exports = class {
	constructor() {
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
                    "name": "perm.mod",
                    "value": "Allows access to mod commands:\n"+prefix+"filter [any]\n"+prefix+"music stop"
                },
                {
                	"name": "perm.admin",
                	"value": "Allows access to admin and mod commands:\n"+prefix+"filter [any]\n"+prefix+"music stop\n"+prefix+"giveme [any]"
                },
                {
                	"name": "How to use",
                	"value": "Create and give 'perm.mod' and/or 'perm.admin' role to a user."
                }
            ],
            "color": "454545",
            "description": "----------------------",
            "title": "Roles Help"
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