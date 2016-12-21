const login = require('./login.json');
const Collection = require('./collection.js');
const Garner = require('./garner.js');
const guildInfo = new Garner(login.guildInfo.username, 'guildinfo', 'client', login.guildInfo.password);

class TextParser {
	constructor() {

	}

	static parse(message) {
		let text = message.content.split(' ');
		getGuild(message.guild.id, message.channel, (guildObject) => {
			if (text[0][0] == guildObject.symbol) {
				switch(text.shift().substr(1).toLowerCase()) {
					case "filter":
						TextParser.filter(text, message, guildObject);
						break;
					case "giveme":
						TextParser.giveme(text, message, guildObject);
						break;
					case "help":
						TextParser.help(text, message);
						break;
					case "music":
						TextParser.music(text, message, guildObject);
						break;
					case "roles":
						TextParser.roles(text, message, guildObject);
						break;
					default:
						break;
				}
			} else {
				TextParser.filterMessage(message, guildObject);
			}
		});
	}

	static filter(text, message, guildObject) {
		let channel;
		let word;
		switch(text[0].toLowerCase()) {
			case "on":
				channel = message.mentions.channels.first();
				if (channel && findRole(2, message.member.roles, guildObject.roles)) {
					let filterIds = guildObject.filter.channelIds;
					if (filterIds.indexOf(channel.id) == -1) {
						filterIds.push(channel.id);
						updateGuildFilter(guildObject.guildId, guildObject.filter, message.channel, (guildObject) => {
							message.channel.sendMessage('That channel is now being monitored.');
						});
					} else {
						message.channel.sendMessage('That channel is now being monitored.');
					}
				}
				break;
			case "off":
				channel = message.mentions.channels.first();
				if (channel && findRole(2, message.member.roles, guildObject.roles)) {
					let filterIds = guildObject.filter.channelIds;
					const channelIndex = filterIds.indexOf(channel.id);
					if (channelIndex != -1) {
						filterIds.splice(channelIndex, 1);
						updateGuildFilter(guildObject.guildId, guildObject.filter, message.channel, (guildObject) => {
							message.channel.sendMessage('That channel won\'t be monitored.');
						});
					} else {
						message.channel.sendMessage('That channel is won\'t be monitored.');
					}
				}
				break;
			case "set":
				word = text[1].toLowerCase();
				if (findRole(2, message.member.roles, guildObject.roles)) {
					let filterWords = guildObject.filter.words;
					if (filterWords.indexOf(word) == -1) {
						filterWords.push(word);
						updateGuildFilter(guildObject.guildId, guildObject.filter, message.channel, (guildObject) => {
							message.channel.sendMessage('Messages containing that word will be removed.');
						});
					} else {
						message.channel.sendMessage('Messages containing that word will be removed.');
					}
				}
				break;
			case "remove":
				word = text[1].toLowerCase();
				if (findRole(2, message.member.roles, guildObject.roles)) {
					let filterWords = guildObject.filter.words;
					const wordIndex = filterWords.indexOf(word);
					if (wordIndex != -1) {
						filterWords.splice(wordIndex, 1);
						updateGuildFilter(guildObject.guildId, guildObject.filter, message.channel, (guildObject) => {
							message.channel.sendMessage('Messages containing that word will be removed.');
						});
					} else {
						message.channel.sendMessage('Messages containing that word will be removed.');
					}
				}
				break;
			case "list":
				let channelIds = guildObject.filter.channelIds;
				let output = message.guild.name+"\n\nFiltered Channels:\n";

				
				for (let i = 0; i < channelIds.length; i++) {
					let channel = message.guild.channels.find('id', channelIds[i]);
					if (channel) {
						output += '\n+ #'+channel.name;
					} else {
						output += '\n #'+channelIds[i];
					}
				}


				output += "\n\nFiltered Words:\n- "+guildObject.filter.words.join('\n- ');

				message.author.sendCode('diff', output);
				break;
		}
	}

	static filterMessage(message, guildObject) {
		const text = message.content.split(' ');
		const filterWords = guildObject.filter.words;

		for (let i = 0; i < filterWords.length; i++) {
			if (text.indexOf(filterWords[i]) != -1) {
				message.delete()
				.then(() => {
					message.author.sendMessage('Please refrain from using filtered words in '+message.channel.name+'.\nFor more information on what words are filtered, please use '+guildObject.symbol+'filter list in the guild\'s chat');
				});
				break;
			}
		}
	}

	static roles(text, message, guildObject) {
		let roles = guildObject.roles
		if (roles.admin === '' && text[0]) {
			if (text[0].toLowerCase() === 'set' && text[1].toLowerCase() === 'admin' && text[2]) {
				let adminName = text.slice(2).join(' ').toLowerCase();
				let adminRole = message.guild.roles.find((item) => {return (item.name.toLowerCase() === adminName)});
				if (adminRole) {
					roles.admin = adminRole.id;
					updateGuildRoles(guildObject.guildId, roles, message.channel, (guildObject) => {
						message.channel.sendMessage('That role is now the bot admin.');
					});
				} else {
					message.channel.sendMessage('Unable to make '+adminName+' the admin role.')
				}
			} else {
				message.channel.sendMessage('Please set up an admin role');
			}
		} else if (findRole(2, message.member.roles, roles)) {
			switch(text[0].toLowerCase()) {
				case "set":
					if (text[1] === 'admin') {

					} else if (text[1] === 'mod') {

					}
					break;
				case "remove":
                                        if (text[1] === 'admin') {

                                        } else if (text[1] === 'mod') {

                                        }

					break;
				case "list":
					break;
			}
		}
	}

	static giveme(text, message, guildObject) {
		let roleAbb;
		let giveme;
		switch(text[0].toLowerCase()) {
			case "set":
				roleAbb = text[1].toLowerCase();
				let roleName = text.slice(2).join(' ').toLowerCase();
				giveme = guildObject.giveme;

				if (findRole(2, message.member.roles, guildObject.roles)) {
					if (roleAbb && roleName) {
						if (!giveme.find('name', roleAbb)) {
							let role = message.guild.roles.find((item) => {return (item.name.toLowerCase() == roleName)});
							if (role) {
								giveme.add({
									"name": roleAbb,
									"id": role.id
								});
								updateGuildGiveme(guildObject.guildId, giveme.array, message.channel, (guildObject) => {
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
				} else {
					message.channel.sendMessage('Admin role not found');
				}
				break;
			case "remove":
				roleAbb = text[1].toLowerCase();
				giveme = guildObject.giveme;

				if (findRole(2, message.member.roles, guildObject.roles)) {
					if (roleAbb) {
						let role = giveme.find('name', roleAbb);
						if (role) {
							giveme.delete('name', roleAbb);
							updateGuildGiveme(guildObject.guildId, giveme.array, message.channel, (guildObject) => {
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
				let givemeNames = guildObject.giveme.getAll('name');

				if (givemeNames.length == 0) {
					message.channel.sendMessage('There are no roles that I can give.');
				} else {
					message.channel.sendMessage(givemeNames.join('\n'));
					// Check for existance in the guild
				}
				break;
			default:
				roleAbb = text[0].toLowerCase();
				giveme = guildObject.giveme;
				if (roleAbb) {
					let givemeRole = giveme.find('name', roleAbb);
					if (givemeRole) {
						let role = message.guild.roles.find('id', givemeRole.id);
						if (role) {
							message.member.addRole(role);
							message.delete()
							.then(() => {})
							.catch(() => {});
						}
					}
				}
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

module.exports = function() {};

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

updateGuildRoles = function(guildId, replaceItem, messageChannel, thenFunction) {
        return guildInfo.updateItem('guildId', guildId, 'roles', replaceItem)
        .then(createGuildObject)
        .then(thenFunction)
        .catch(function(err) {
                catchError(err, 'Roles.updateGuild', messageChannel);
        });	
}
updateGuildFilter = function(guildId, replaceItem, messageChannel, thenFunction) {
	return guildInfo.updateItem('guildId', guildId, 'filter', replaceItem)
	.then(createGuildObject)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Filter.updateGuild', messageChannel);
	});
}
updateGuildMusic = function(guildId, replaceItem, messageChannel, thenFunction) {
	return guildInfo.updateItem('guildId', guildId, 'music', replaceItem)
	.then(createGuildObject)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Music.updateGuild', messageChannel);
	});
}
updateGuildTrivia = function(guildId, replaceItem, messageChannel, thenFunction) {
	return guildInfo.updateItem('guildId', guildId, 'trivia', replaceItem)
	.then(createGuildObject)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Trivia.updateGuild', messageChannel);
	});
}
updateGuildGiveme = function(guildId, replaceItem, messageChannel, thenFunction) {
	return guildInfo.updateItem('guildId', guildId, 'giveme', replaceItem)
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
				"admin": '',
				"mod": ''
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
