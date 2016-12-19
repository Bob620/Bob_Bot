const login = require('./login.json');
const Collection = require('./collection.js');
const guildInfo = new Garner(login.guildInfo.username, 'guildinfo', 'client', login.guildInfo.password);

class TextParser {
	constructor() {

	}

	static parse(message) {
		let text = message.content.split(' ');
		getGuild(message.guild.id, message.channel, (guildObject) => {
			if (text[0].startswith(guildObject.symbol)) {
				switch(text.shift().substr(1).toLowerCase()) {
					case "filter":
						this.filter(text, message, guildObject);
						break;
					case "giveme":
						this.giveme(text, message, guildObject);
						break;
					case "help":
						this.help(text, message);
						break;
					case "music":
						this.music(text, message, guildObject);
					default:
						break;
				}
			} else {
				this.filterMessage(message, guildObject);
			}
		});
	}

	static filter(text, message, guildObject) {
		switch(text[0].toLowerCase()) {
			case "on":
				const channel = message.mentions.channels.first();
				if (channel && findRole(2, message.member.roles, guildObject.roles.admin)) {
					let filterIds = guildObject.filter.channelIds;
					if (filterIds.indexof(channel.id) == -1) {
						filterIds.push(channel.id);
						updateGuildFilter(guildObject.guildId, guildObject.filter, message.channel, (guildObject) => {
							message.channel.sendMessage('That channel is now being monitored.');
						});
					}
					message.channel.sendMessage('That channel is now being monitored.');
				}
				break;
			case "off":
				const channel = message.mentions.channels.first();
				if (channel && findRole(2, message.member.roles, guildObject.roles.admin)) {
					let filterIds = guildObject.filter.channelIds;
					const channelIndex = filterIds.indexof(channel.id);
					if (channelIndex != -1) {
						filterIds.splice(channelIndex, 1);
						updateGuildFilter(guildObject.guildId, guildObject.filter, message.channel, (guildObject) => {
							message.channel.sendMessage('That channel won\'t be monitored.');
						});
					}
					message.channel.sendMessage('That channel is won\'t be monitored.');
				}
				break;
			case "set":
				const word = text[1].toLowerCase();
				if (channel && findRole(2, message.member.roles, guildObject.roles.admin)) {
					let filterWords = guildObject.filter.words;
					if (filterWords.indexof(word) == -1) {
						filterwords.push(word);
						updateGuildFilter(guildObject.guildId, guildObject.filter, message.channel, (guildObject) => {
							message.channel.sendMessage('Messages containing that word will be removed.');
						});
					}
					message.channel.sendMessage('Messages containing that word will be removed.');
				}
				break;
			case "remove":
				const word = text[1].toLowerCase();
				if (channel && findRole(2, message.member.roles, guildObject.roles.admin)) {
					let filterWords = guildObject.filter.words;
					const wordIndex = filterWords.indexof(word);
					if (wordIndex != -1) {
						filterwords.splice(wordIndex, 1);
						updateGuildFilter(guildObject.guildId, guildObject.filter, message.channel, (guildObject) => {
							message.channel.sendMessage('Messages containing that word will be removed.');
						});
					}
					message.channel.sendMessage('Messages containing that word will be removed.');
				}
				break;
			case "list":
				const filter = guildObject.filter;
				let output = message.guild.name+"\n\nFiltered Channels:\n"+filter.channelIds.join('\n- #');
				output += "\n\nFiltered Words:\n- "+filter.words.join('\n- ');

				message.author.sendCode('diff', output);
				break;
		}
	}

	static filterMessage(message, guildObject) {
		const text = message.context.split(' ');
		const filterWords = guildObject.filter.words;

		for (let i = 0; i < filterWords.length; i++) {
			if (text.indexof(filterWords[i]) != -1) {
				message.delete()
				.then(() => {
					message.author.sendMessage('Please refrain from using filtered words in '+message.channel.name+'.\nFor more information on what words are filtered, please use '+guildObject.symbol+'filter list in the guild\'s chat');
				});
				break;
			}
		}
	}

	static giveme(text, message, guildObject) {
		switch(text[0].toLowerCase()) {
			case "set":
				const roleAbb = text[1].toLowerCase();
				const roleName = text.slice(2).join(' ').toLowerCase();
				const giveme = guildObject.giveme;

				if (findRole(2, message.member.roles, guildObject.roles.admin)) {
					if (roleAbb && roleName) {
						if (!giveme.find('name', roleAbb)) {
							if ((let role = message.guild.roles.find((item) => {item.name.toLowerCase() == role.Name}))) {
								giveme.add({
									"name": roleAbb,
									"id": role.id
								});
								updateGuildGiveme(guildObject.guildId, giveme, message.channel, (guildObject) => {
									message.channel.sendMessage('I can now provide that role.');
								});
							} else {
								message.channel.sendMessage('I couldn\'t find that role in this guild.');
							}
						} else {
							message.channel.sendMessage('I am already providing a role with that name.');
						}
					} else {
						message.channel.sendMessage('Please include both a name for the role and the role\'s name');
					}
				}
				break;
			case "remove":
				const roleAbb = text[1].toLowerCase();
				const giveme = guildObject.giveme;

				if (findRole(2, message.member.roles, guildObject.roles.admin)) {
					if (roleAbb) {
						let role = giveme.find('name', roleAbb);
						if (role) {
							giveme.delete(role);
							updateGuildGiveme(guildObject.guildId, giveme, message.channel, (guildObject) => {
								message.channel.sendMessage('I will no longer provide that role.');
							});
						} else {
							message.channel.sendMessage('I will no longer provide that role.');
						}
					} else {
						message.channel.sendMessage('Please include a role to remove.');
					}
				}
				break;
			case "list":
				const givemeNames = guildObject.giveme.getAll('name');

				if (givemeNames.length == 0) {
					messageChannel.sendMessage('There are no roles that I can give.');
				} else {
					messageChannel.sendMessage(givemeNames.join('\n'));
					// Check for existance in the guild
				}
				break;
			default:
				break;
		}
	}

	static help(text, message) {

	}

	static music(text, message, guildObject) {

	}
}

class DMParser {
	constructor() {
		
	}

	static parse(message) {

	}
}

class GroupParser {
	constructor() {
		
	}

	static parse(message) {

	}
}

module.exports.TextParser = TextParser;
module.exports.DMParser = DMParser;
module.exports.GroupParser = GroupParser;

function findRole(roleMin, userRoles, roles) {
	let trueRole = 0;
	if (roles.mod && userRoles.find('id', roles.mod)) {
		trueRole = 1;
	}
	if (roles.admin && userRoles.find('id', roles.admin)) {
		trueRole = 2;
	}
	if (roleMin <= trueRole) {
		return true;
	}
	return false;

}

Bobbot.prototype.updateGuildFilter = function(guildId, replaceItem, messageChannel, thenFunction) {
	return guildInfo.updateItem('guildId', guildId+'test', 'filter', replaceItem)
	.then(createGuildObject)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Filter.updateGuild', messageChannel);
	});
}
Bobbot.prototype.updateGuildMusic = function(guildId, replaceItem, messageChannel, thenFunction) {
	return guildInfo.updateItem('guildId', guildId+'test', 'music', replaceItem)
	.then(createGuildObject)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Music.updateGuild', messageChannel);
	});
}
Bobbot.prototype.updateGuildTrivia = function(guildId, replaceItem, messageChannel, thenFunction) {
	return guildInfo.updateItem('guildId', guildId+'test', 'trivia', replaceItem)
	.then(createGuildObject)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Trivia.updateGuild', messageChannel);
	});
}
Bobbot.prototype.updateGuildGiveme = function(guildId, replaceItem, messageChannel, thenFunction) {
	return guildInfo.updateItem('guildId', guildId+'test', 'giveme', replaceItem)
	.then(createGuildObject)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Giveme.updateGuild', messageChannel);
	});
}
function getGuild(guildId, messageChannel, thenFunction = () => {}) {
	return guildInfo.searchFor('guildId', guildId+'test', 1)
	.then(createGuildObject)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'GetGuild', messageChannel);
	});
}

function createGuildObject(guildInfo) {
	if (guildInfo != []) {
		guildInfo = guildInfo[0];
		var guildObject = {};

		// GuildId
		guildObject.guildId = guildInfo.guildId;

		// Symbol
		if (guildInfo.symbol) {
			guildObject.symbol = guildInfo.symbol;
		} else {
			guildObject.symbol = '!';
		}

		// Roles
		if (guildInfo.roles) {
			guildObject.roles = guildInfo.roles;
		} else {
			guildObject.roles = {
				"admin": false,
				"mod": false
			}
		}

		// Giveme
		if (guildInfo.giveme) {
			var giveme = guildInfo.giveme;
		} else {
			var giveme = [];
		}
		guildObject.giveme = new Collection(giveme);

		// Music
		if (guildInfo.music) {
			var music = guildInfo.music;
		} else {
			var music = {
				"currentSong": false,
				"playlist": [],
				"cuurentTime": 0,
				"channelId": false
			}
		}
		guildObject.music = music;
		guildObject.music.playlist = new Collection(music.playlist);

		// Filter
		if (guildInfo.filter) {
			var filter = guildInfo.filter;
		} else {
			var filter = {
				"words": [],
				"channelId": []
			}
		}
		guildObject.filter = filter;
//		guildObject.filter.words = new Collection(filter.words);
//		guildObject.filter.channelIds = new Collection(filter.channelIds);

		// Trivia
		if (guildInfo.trivia) {
			var trivia = guildInfo.trivia;
		} else {
			var trivia = {
				"points": [],
				"questions": [],
				"difficulty": []
			}
		}
		guildObject.trivia = trivia;
		guildObject.trivia.points = new Collection(trivia.points);
		guildObject.trivia.questions = new Collection(trivia.questions);
		guildObject.trivia.difficulty = new Collection(trivia.difficulty);
		
		return guildObject;
	} else {
		return false;
	}
}

function catchError(err, location, messageChannel) {
	console.log(err);
	console.log(location);

	messageChannel.sendMessage('I seem to have encountered an error, please try again.');
}