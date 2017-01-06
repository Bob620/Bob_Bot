module.exports = class {
	constructor() {
	}
	static add(server, message, link) {

	}
	static skip(server, message) {

	}
	static pause(server, message) {

	}
	static stop(server, message) {

	}
	static join(server, message, channelName) {

	}
	static leave(server, message) {

	}
	static playlist(server, message) {

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
                    "name": prefix+"music add [link]",
                    "value": "Adds a new Youtube song to the playlist\nMaximum video length of 10 minutes"
                },
                {
                    "name": prefix+"music skip",
                    "value": "Skips the current song if the majority in the music voice channel use it"
                },
                {
                    "name": prefix+"music pause",
                    "value": "Pauses the music if the majority in the music voice channel use it on the same song"
                },
                {
                    "name": prefix+"music stop",
                    "value": "Required Permissions: Mods+\nStops the current song and clears the playlist"
                },
                {
                	"name": prefix+"music join [voice channel name]",
                	"value": "Required Permissions: Mods+\nJoins the [voice channel name]\nAuto-reconnect if bot restarts"
                },
                {
                	"name": prefix+"music leave",
                	"value": "Required Permissions: Mods+\nLeaves the current voice channel"
                },
                {
                    "name": prefix+"music playlist",
                    "value": "Displays the playlist\nSends a PM"
                }
            ],
            "color": "353535",
            "description": "----------------------",
            "title": "Music Help"
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