module.exports = class {
    constructor(server, message) {
        this.server = server;
        this.message = message;
    }
    set(word) {
        const filter = this.server.filter;
        if (!filter.words.has(word)) {
            filter.words.add(word);
            filter.update()
            .then(() => {
                this.message.channel.sendMessage("That word will be filtered.")
                .then(() => {

                })
                .catch(() => {

                });
            })
            .catch(() => {
                this.message.channel.sendMessage("I encountered an error. Try again later.")
                .then(() => {

                })
                .catch(() => {

                });
            });
        } else {
            this.message.channel.sendMessage("That word will be filtered.")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    remove(word) {
        const filter = this.server.filter;
        if (filter.words.has(word)) {
            filter.words.delete(word);
            filter.update()
            .then(() => {
                this.message.channel.sendMessage("That word will not be filtered.")
                .then(() => {

                })
                .catch(() => {

                });
            })
            .catch(() => {
                this.message.channel.sendMessage("I encountered an error. Try again later.")
                .then(() => {

                })
                .catch(() => {

                });
            });
        } else {
            this.message.channel.sendMessage("That word will not be filtered.")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    watch(channelName) {
        const filter = this.server.filter;
        const guildChannels = this.message.guild.channels;
        const channelId = guildChannels.find('name', channelName);
        if (channelId !== undefined) {
            if (!filter.channels.has(channelId)) {
                    filter.channels.add(channelId);
                    filter.update()
                    .then(() => {
                        this.message.channel.sendMessage("That channel will be monitored.")
                        .then(() => {

                        })
                        .catch(() => {

                        });
                    })
                    .catch(() => {
                        this.message.channel.sendMessage("I encountered an error. Try again later.")
                        .then(() => {

                        })
                        .catch(() => {

                        });
                    });
            } else {
                this.message.channel.sendMessage("That channel will be monitored.")
                .then(() => {

                })
                .catch(() => {

                });
            }
        } else {
            this.message.channel.sendMessage("That channel does not exist.")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    ignore(channelName) {
        const filter = this.server.filter;
        if (filter.channels.has(channelName)) {
            filter.channels.delete(channelName);
            filter.update()
            .then(() => {
                this.message.channel.sendMessage("That channel will not be monitored.")
                .then(() => {

                })
                .catch(() => {

                });
            })
            .catch(() => {
                this.message.channel.sendMessage("I encountered an error. Try again later.")
                .then(() => {

                })
                .catch(() => {

                });
            });
        } else {
            this.message.channel.sendMessage("That channel will not be monitored.")
            .then(() => {

            })
            .catch(() => {

            });
        }
    }
    list() {
        const words = this.server.filter.words.array;
        const channels = this.server.filter.channels.array;
        const guildChannels = this.message.guild.channels;
        let outputContent = this.message.guild.name;
        outputContent += "\n\nFiltered Channels:\n";
        if (channels.length > 0) {
            for (let i = 0; i < channels.length; i++) {
                const channel = guildChannels.get(channels[i]);
                if (channel !== undefined) {
                    outputContent += "+ #"+channel.name;
                } else {
                    outputContent += "- #"+channel.name;
                }
            }
        } else {
            outputContent += "No channels filtered";
        }
        outputContent += "\n\nFiltered Words:\n";
        if (words.length > 0) {
            outputContent += "- "+words.join('\n- ');
        } else {
            outputContent += "No words filtered"; 
        }
        outputContent += "\n\nKey:\n+ Exists/Capable of monitoring\n- Does not exists/requires removal";
        this.message.member.sendCode("diff", outputContent)
        .then(() => {

        })
        .catch(() => {

        });
    }
    basicHelp() {
        const prefix = this.server.prefix;
        this.message.channel.sendMessage("Use \""+prefix+"filter\" to modify the filter. Requires Admin or higher. \n\""+prefix+"help filter\" for more information.")
        .then(() => {

        })
        .catch(() => {

        });
    }
    help() {
        const prefix = this.server.prefix;
        this.message.delete()
        .then(() => {

        })
        .catch(() => {

        });
        this.message.member.sendCode("diff", this.message.guild.name+"\n\nFilter Help\n\n"+prefix+"filter set [word]\n+ Used to filter specific words\n\n"+prefix+"filter remove [word]\n+ Used to stop filtering a specific word\n\n"+prefix+"filter watch [Channel Name]\n+ Used to monitor a channel for the filtered words\n\n"+prefix+"filter ignore [Channel Name]\n+ Used to stop monitoring a channel for the filtered words\n\n"+prefix+"filter list\n+ Displays currently monitored channels and filtered words")
        .then(() => {

        })
        .catch(() => {

        });
    }
}