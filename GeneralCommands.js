const fs = require('fs');

module.exports = class {
    constructor() {
    }
    static flip(server, message) {
        if (Math.floor(Math.random() * 2)) {
            message.channel.sendMessage("I flipped a catgirl she landed ***Ears*** up")
            .then(() => {

            })
            .catch(() => {

            });
        } else {
            message.channel.sendMessage("I flipped a catgirl and she landed ***Tails*** up")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    static nsfw(server, message) {
        fs.readdir('./images/nsfw', (err, files) => {
            if (err) {

            } else {
                const totalFiles = files.length;
                const name = files[Math.floor(Math.random() * totalFiles)];

                message.channel.sendFile('./images/nsfw/'+name, name)
                .then(() => {

                })
                .catch((err) => {
                    console.log(err);
                })
            }
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
                    "name": prefix+"flip",
                    "value": "Flips a cat girl and tells you if she landed ***Tails*** or ***Ears*** up"
                },
                {
                    "name": prefix+"nsfw",
                    "value": "I shouldn't have to tell you.\nIf I do have to tell you, don't just go googling it..."
                },
                {
                    "name": "Commands that will be implemented eventually"
                    "value": ""
                }
            ],
            "color": "656565",
            "description": "----------------------",
            "title": "General Commands"
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