const Discord = require('discord.js');
const fs = require('fs');

module.exports = class {
    constructor() {
    }
    static parse(server, message) {
        const filter = server.filter;
        if (filter.channels.has(message.channel.id)) {
            const content = message.content.split(' ');
            for (let i = 0; i < content.length; i++) {
                const word = content[i].toLowerCase();
                if (filter.words.has(word)) {
                    message.delete()
                    .then(() => {
                        message.member.sendMessage("Please refrain from using banned words in #"+message.channel.name+" part of "+message.guild.name+"\nFor more information use '"+server.prefix+"filter list' in the server channel.\n");
                    })
                    .catch(() => {
                        console.log("Error deleting message");
                    });
                    break;
                }
            }
        }
    }
    static help(server, message) {
        const prefix = server.prefix;
        message.member.sendEmbed(new Discord.RichEmbed({
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
                    "name": prefix+"help commands",
                    "value": "Provides a list of general commands"
                },
                {
                    "name": prefix+"help music",
                    "value": "Displays the help for music\nSends a PM"
                },
                {
                    "name": "------------------------------------------------------",
                    "value": "Primarily Mod and Admin commands"
                },
                {
                    "name": prefix+"help filter",
                    "value": "Displays the help for filter\nSends a PM"
                },
                {
                    "name": prefix+"help giveme",
                    "value": "Displays the help for giveme\nSends a PM"
                },
                {
                    "name": prefix+"help roles",
                    "value": "Displays the help for roles\nSends a PM"
                },
                {
                    "name": prefix+"prefix [prefix]",
                    "value": "Required Permissions: Admin+\nWARNING: POTENTIAL COMPLICATIONS IF USED AFTER INTEGRATION WITH USERS\nChanges the prefix, default '!', to a new symbol"
                },
                {
                    "name": "Prefix Suggestions",
                    "value": "Default: !\nOther avalible prefixes: $, ~, ?, >, `"
                }
            ],
            "color": "555555",
            "description": "----------------------",
            "title": "General Help"
        }))
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