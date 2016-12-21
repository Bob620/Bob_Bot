"use strict"

var Discord = require('discord.js');
var ChatParser = require('./ChatParser.js');

class BobBot {
	constructor(clientID) {
		this.client = new Discord.Client();
		this.client.on('message', BobBot.messageParser.bind(this));
		this.client.login(clientID);
	}

	static messageParser(message) {
		if (!message.system && !message.pinned && message.author.id !== this.client.user.id) {
			switch(message.channel.type) {
				case "text":
					ChatParser.TextParser.parse(message);
					break;
				case "dm":
					break;
				case "group":
					break;
			}
		}
	}
}

module.exports = BobBot
