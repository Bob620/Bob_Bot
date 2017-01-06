const Discord = require('discord.js');

module.exports = class {
    constructor() {
    }
    static set(server, message, word) {
        const filter = server.filter;
        if (!filter.words.has(word)) {
            filter.words.add(word);
            filter.update()
            .then(() => {
                message.channel.sendMessage("That word will be filtered.")
                .then(() => {

                })
                .catch(() => {
                    console.log("Error sending message");
                });
            })
            .catch((err) => {
                console.log(err);
                message.channel.sendMessage("I encountered an error. Try again later.")
                .then(() => {

                })
                .catch(() => {
                    console.log("Error sending message");
                });
            });
        } else {
            message.channel.sendMessage("That word will be filtered.")
            .then(() => {

            })
            .catch(() => {
                    console.log("Error sending message");
            });
        }
    }
    static remove(server, message, word) {
        const filter = server.filter;
        if (filter.words.has(word)) {
            filter.words.delete(word);
            filter.update()
            .then(() => {
                message.channel.sendMessage("That word will not be filtered.")
                .then(() => {

                })
                .catch(() => {
                    console.log("Error sending message");
                });
            })
            .catch(() => {
                message.channel.sendMessage("I encountered an error. Try again later.")
                .then(() => {

                })
                .catch(() => {
                    console.log("Error sending message");
                });
            });
        } else {
            message.channel.sendMessage("That word will not be filtered.")
            .then(() => {

            })
            .catch(() => {
                console.log("Error sending message");
            });
        }
    }
    static watch(server, message, channelName) {
        const filter = server.filter;
        const channel = message.guild.channels.find((channel) => {
            if (channel.name.toLowerCase() === channelName) {
                return true;
            }
        });

        if (channel !== null) {
            if (!filter.channels.has(channel.id)) {
                    filter.channels.add(channel.id);
                    filter.update()
                    .then(() => {
                        message.channel.sendMessage("That channel will be monitored.")
                        .then(() => {

                        })
                        .catch(() => {
                            console.log("Error sending message");
                        });
                    })
                    .catch(() => {
                        message.channel.sendMessage("I encountered an error. Try again later.")
                        .then(() => {

                        })
                        .catch(() => {
                            console.log("Error sending message");
                        });
                    });
            } else {
                message.channel.sendMessage("That channel will be monitored.")
                .then(() => {

                })
                .catch(() => {
                    console.log("Error sending message");
                });
            }
        } else {
            message.channel.sendMessage("That channel does not exist.")
            .then(() => {

            })
            .catch(() => {
                console.log("Error sending message");
            });
        }
    }
    static ignore(server, message, channelName) {
        const filter = server.filter;
        const channel = message.guild.channels.find((channel) => {
            if (channel.name.toLowerCase() === channelName) {
                return true;
            }
        });

        if (channel !== null && filter.channels.has(channel.id)) {
            filter.channels.delete(channel.id);
            filter.update()
            .then(() => {
                message.channel.sendMessage("That channel will not be monitored.")
                .then(() => {

                })
                .catch(() => {
                    console.log("Error sending message");
                });
            })
            .catch(() => {
                message.channel.sendMessage("I encountered an error. Try again later.")
                .then(() => {

                })
                .catch(() => {
                    console.log("Error sending message");
                });
            });
        } else {
            message.channel.sendMessage("That channel will not be monitored.")
            .then(() => {

            })
            .catch(() => {
                console.log("Error sending message");
            });
        }
    }
    static list(server, message) {
        const words = server.filter.words.array;
        const channels = server.filter.channels.array;
        let outputContent = message.guild.name;
        outputContent += "\n\nFiltered Channels:";
        if (channels.length > 0) {
            for (let i = 0; i < channels.length; i++) {
                const channel = message.guild.channels.get(channels[i]);
                if (channel !== undefined) {
                    outputContent += "\n+ #"+channel.name;
                } else {
                    outputContent += "\n- #"+channel.name;
                }
            }
        } else {
            outputContent += "No channels monitored";
        }
        outputContent += "\n\nFiltered Words:\n";
        if (words.length > 0) {
            outputContent += "+ "+words.join('\n- ');
        } else {
            outputContent += "No words filtered"; 
        }
        outputContent += "\n\nKey:\n+ Exists/Capable of monitoring\n- Does not exists/requires removal";
        message.member.sendCode("diff", outputContent)
        .then(() => {
            message.channel.sendMessage("<@"+message.author.id+"> , I've sent you a PM with the list.")
            .then(() => {

            })
            .catch(() => {

            });
        })
        .catch(() => {
            console.log("Error sending message");
        });
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
                    "name": prefix+"filter set [word]",
                    "value": "Sets [word] to be filtered"
                },
                {
                    "name": prefix+"filter remove [word]",
                    "value": "Removes [word] from the filter"
                },
                {
                    "name": prefix+"filter monitor [channel name]",
                    "value": "Used to monitor [channel name]"
                },
                {
                    "name": prefix+"filter ignore [channel name]",
                    "value": "Used to stop monitoring [channel name]"
                },
                {
                    "name": prefix+"filter list",
                    "value": "Used to display the monitored channels and filtered words\nSends a PM"
                }
            ],
            "color": "151515",
            "description": "----------------------",
            "title": "Filter Help"
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