"use strict"

var Discord = require('discord.js');
var Garner = require('./garner.js');
var ytdl = require('ytdl-core');

function Bobbot(clientID, loginData) {

	this.garner = {};
	this.voice = {};
	this.bannedWords = {};

	this.garner.commands = new Garner(loginData.commands.username, 'commands', 'client', loginData.commands.password);
	this.garner.guildInfo = new Garner(loginData.guildInfo.username, 'guildinfo', 'client', loginData.guildInfo.password);

	this.connected = false;
	this.rotationItem = 0;
	this.totalFaults = 0;

	this.builtInCommands = {};

	this.rotationInfo = ['Being Developed', '$uptime'];

	this.client = new Discord.Client();

	var self = this;

	setInterval(function() {
		self.infoRotation();
	}, 15000);

	self.client.on('ready', function() {
		self.connected = true;
		self.client.user.setStatus('online');
		self.rotationItem = 0;
		self.infoRotation();
	});
	self.client.on('disconnect', function() {
		self.connected = false;
	});
	self.client.on('reconnecting', function() {

	});
	self.client.on('debug', function(debug) {
		console.log(debug);
	});
	self.client.on('message', function(message) {
		self.parseMessage(message);
	});
	self.client.on('error', function(err) {
		console.log(err);
	});
	self.client.on('userUpdate', function(info) {
		//console.log('userUpdate');
		//console.log(info);
	});

	self.client.on('guildMemberRemove', function(info) {
		//console.log('guildMemberRemove');
		//console.log(info);
	});
	self.client.on('guildBanAdd', function(info) {
		console.log('guildBanAdd');
		console.log(info);
	});
	self.client.on('guildBanRemove', function(info) {
		console.log('guildBanRemove');
		console.log(info);
	});
	self.client.on('guildMemberAdd', function(info) {
		//console.log('guildMemberAdd');
		//console.log(info);
	});

	self.client.on('guildUpdate', function(info) {
		//console.log('guildUpdate');
		//console.log(info);
	});

	self.client.on('warn', function(info) {
		console.log('warn');
		console.log(info);
	});

	self.client.on('presenceUpdate', function(info) {
		//if (!info.user.bot) {
		//	console.log('presenceUpdate');
		//	console.log(info);
		//}
	});
	self.client.on('channelUpdate', function(info) {
		//console.log('channelUpdate');
		//console.log(info);
	});
	self.client.on('guildMemberUpdate', function(info) {
		//console.log('guildMemberUpdate');
		//console.log(info);
	});
	self.client.on('voiceStateUpdate', function(info) {
		//console.log('voiceStateUpdate');
		//console.log(info);
	});

	self.client.login(clientID);
}

Bobbot.prototype.parseMessage = function(message) {
	var self = this;
	var content = message.content.split(' ');

	//console.log(message);
	if (message.author.discriminator != '8972') {
		if (content[0][0] == '!') {
			var commandName = content[0].slice(1).toLowerCase();
			switch (message.channel.type) {
				case "text":
					if (message.guild.available) {
						var guildId = message.guild.id;
						var messageChannel = message.channel;

						switch(commandName) {
							case "filter":
								if (content[1]) {
									switch(content[1].toLowerCase()) {
										case "on":
											var requestedChannel = message.mentions.channels.first();

											if (requestedChannel && message.member.roles.find('name', 'Bobbot Admin')) {
												self.getGuild(guildId, messageChannel,
												function(guildInfo) {
													var filter = guildInfo[0].filter;
													var channelIndex = filter.channelIds.indexOf(requestedChannel.id);

													if (channelIndex == -1) {
														filter.channelIds.push(requestedChannel.id);

														self.updateGuildFilter(guildId, filter, messageChannel,
														function(guildInfo) {
															messageChannel.sendMessage('I will monitor that channel.');
														});
													} else {
														messageChannel.sendMessage('I will monitor that channel.');
													}
												});
											}
											break;
										case "off":
											var requestedChannel = message.mentions.channels.first();

											if (requestedChannel && message.member.roles.find('name', 'Bobbot Admin')) {
												self.getGuild(guildId, messageChannel,
												function(guildInfo) {
													var filter = guildInfo[0].filter;
													var channelIndex = filter.channelIds.indexOf(requestedChannel.id);

													if (channelIndex != -1) {
														filter.channelIds.splice(channelIndex, 1);

														self.updateGuildFilter(guildId, filter, messageChannel,
														function(guildInfo) {
															messageChannel.sendMessage('I will not monitor that channel.');
														});
													} else {
														messageChannel.sendMessage('I will not monitor that channel.');
													}
												});
											}
											break;
										case "set":
											if (content[2] && message.member.roles.find('name', 'Bobbot Admin')) {
												var word = content[2].toLowerCase();
												
												self.getGuild(guildId, messageChannel,
												function(guildInfo) {
													var filter = guildInfo[0].filter;

													if (filter.words.indexOf(word) == -1) {
														filter.words.push(word);

														self.updateGuildFilter(guildId, filter, messageChannel,
														function(guildInfo) {
															messageChannel.sendMessage('That word will be filtered.');
														});
													} else {
														messageChannel.sendMessage('That word will be filtered');
													}
												});
											}
											break;
										case "remove":
											if (content[2] && message.member.roles.find('name', 'Bobbot Admin')) {
												var word = content[2].toLowerCase();
												
												self.getGuild(guildId, messageChannel,
												function(guildInfo) {
													var filter = guildInfo[0].filter;

													var wordIndex = filter.words.indexOf(word);

													if (wordIndex != -1) {
														filter.words.splice(wordIndex, 1);

														self.updateGuildFilter(guildId, filter, messageChannel,
														function(guildInfo) {
															messageChannel.sendMessage('That word will not be filtered.');
														});
													} else {
														messageChannel.sendMessage('That word will not be filtered.');
													}
												});
											}
											break;
										case "list":
											self.getGuild(guildId, messageChannel,
											function(guildInfo) {
												var filter = guildInfo[0].filter;

												var output = message.guild.name+"\n\nFiltered Channels:\n"

												for (var i = 0; i < filter.channelIds.length; i++) {
													var channel = message.guild.channels.find('id', filter.channelIds[i]);
													if (channel && channel.name) {
														output += "- #"+channel.name+"\n";
													}
												}

												output += "\nFiltered Words:\n- "+filter.words.join('\n- ');

												message.author.sendCode('diff', output);
											});
											break;
									}
								}
								break;
							case "channelid":
								messageChannel.sendMessage(messageChannel.id);
								break;
							case "guildid":
								messageChannel.sendMessage(guildId);
								break;
							case "help":
								//message.reply("Look at the main commands by using !commands");
								break;
							case "checkperms":
								var author = message.author;
								var user = message.mentions.users.first();

								if (!user) {
									user = author;
								}

								messageChannel.sendCode('diff', checkTextPerms(user.username, messageChannel.permissionsFor(user), message.member.roles, message.guild.available));
								break;
							case "summon":
								var voiceChannel = message.member.voiceChannel;
								if (voiceChannel) {
									voiceChannel.join()
									.then(function(connection) {
										self.voice[messageChannel.id] = connection;
									})
									.catch(function() {
										message.reply('I wasn\'t able to connect to that voice channel :/');
									});
								}
								break;
							case "poof":
								if (self.voice[messageChannel.id]) {
									self.voice[messageChannel.id].disconnect();
									delete self.voice[messageChannel.id];
								}
								break;
							case "request":
								if (self.voice[messageChannel.id]) {
									var dispatcher = self.voice[messageChannel.id].playStream(ytdl(content[1], {filter: 'audioonly'}));
									dispatcher.setVolume(0.2);
								}
								break;
							case "giveme":
								if (content[1] && content[1] != '') {
									switch (content[1].toLowerCase()) {
										case "list":
											self.getGuild(guildId, messageChannel,
											function(guildInfo) {
												var givemeKeys = Object.keys(guildInfo[0].giveme);

												if (givemeKeys.length == 0) {
													messageChannel.sendMessage('There are no roles that I can give.');
												} else {
													var output = "";
													for (var i = 0; i < givemeKeys.length; i++) {
														var roleName = givemeKeys[i];
														output += roleName+'\n';
													}
													messageChannel.sendMessage(output);
													// Check for existance in the guild
												}
											});
											break;
										case "set":
											if (content[3] && message.member.roles.find('name', 'Bobbot Admin')) {
												self.getGuild(guildId, messageChannel,
												function(guildInfo) {
													var roleAbb = content[2].toLowerCase();
													var roleName = content.slice(3).join(' ').toLowerCase();
													var giveme = guildInfo[0].giveme;


													var roleId = giveme[roleAbb];
													if (!roleId) {
														var role = message.guild.roles.find(function(item) { return (item.name.toLowerCase() === roleName); });
														if (role) {
															giveme[roleAbb] = role.id;

															self.updateGuildGiveme(guildId, giveme, messageChannel,
															function(newItem) {
																messageChannel.sendMessage('I can now provide that role.');
															});
														} else {
															messageChannel.sendMessage('That isn\'t a role in this guild.');
														}
													} else {
														messageChannel.sendMessage('I already have that role name. If you want to change it please use **!giveme remove '+roleAbb+'**');
													}
												});
											} else {
												messageChannel.sendMessage('You don\'t seem to have the permission to do that');
											}
											break;
										case "remove":
											if (content[2] && message.member.roles.find('name', 'Bobbot Admin')) {
												self.getGuild(guildId, messageChannel,
												function(guildInfo) {
													var roleName = content[2].toLowerCase();
													var giveme = guildInfo[0].giveme;

													if (giveme[roleName]) {
														delete giveme[roleName];

														self.updateGuildGiveme(guildId, giveme, messageChannel,
														function(newItem) {
															messageChannel.sendMessage('I can no longer provide that role.');
														});
													} else {
														messageChannel.sendMessage('I don\'t have that role.');
													}
												});
											} else {
												messageChannel.sendMessage('You don\'t seem to have the permission to do that');
											}
											break;
										default:
											if (content[1]) {
												self.getGuild(guildId, messageChannel,
												function(guildInfo) {
													var roleName = content.slice(1);

													var roleId = guildInfo[0].giveme[roleName];
													if (roleId) {
														message.member.addRole(roleId)
														.then(function() {
															message.delete();
														})
														.catch(function(err) {
															if (err.response.forbidden) {
																messageChannel.sendMessage('I\'m not a Server Admin :/');
															} else {
																messageChannel.sendMessage("That is no longer a role, please contact a bot admin to remove it from giveme.");
															}
														});
													} else {
														messageChannel.sendMessage('I\'m not allowed to give you that.');
													}
												});
											}
											break;
									}
								}
								break;
							default:
								self.garner.commands.searchFor('name', commandName, 1)
								.then(function(commands) {
									if (commands.length > 0) {
										var command = commands[0];
										switch(command.type) {
											case "string":
												messageChannel.sendMessage(command.output);
												break;
											case "random":
												messageChannel.sendMessage(randomSelect(command));
												break;
											case "pseudoSet":
												messageChannel.sendMessage(pseudoSetSelect(command, content[1]));
												break;
											case "set":
												messageChannel.sendMessage(setSelect(command, content[1]));
												break;
										}
									}
								})
								.catch(function(err) {
									console.log(err);
									console.log('Garner Fault');
								});
								break;
						}
					}
					break;
				case "dm":
					switch(content[0].toLowerCase()) {
						case "!help":
							message.reply("Look at the main commands by using !commands");
							break;
						case "!commands":
							message.reply("!help, !perms");
							break;
						case "!checkperms":
							message.channel.sendCode('diff', checkDMPerms(message.author.username));
							break;
					}
					break;
			}
		} else {
			if (message.guild.available) {
				var messageTest = message.cleanContent.split(' ');
				var deleted = false;

				self.garner.guildInfo.searchFor('guildId', message.guild.id,
				function(guildInfo) {
					var filter = guildInfo[0].filter;

					if (filter.channelIds.indexOf(message.channel.id) != -1) {

						var words = filter.words;
						for (var i = 0; i < messageTest.length; i++) {
							for (var x = 0; x < words.length; x++) {
								if (messageTest[i].toLowerCase() == words[x]) {
									message.delete()
									.then(function() {
										message.author.sendMessage('Please refrain from using the word ***'+words[x]+'*** in '+message.channel.name+', for the full list of filtered words please use **!filter list** in '+message.guild.name);
									})
									.catch(function(err) {
										console.log(err);
										if (err.response.forbidden) {
											message.channel.sendMessage('I\'m not a Server Admin :/');
										}
									})
									deleted = true;
									break;
								}
							}
							if (deleted) {
								break;
							}
						}
					}
				})
				.catch(function(err) {
					//catchError(err, 'Filter.passive', message.channel);
				});
			}
		}
	}
}
Bobbot.prototype.infoRotation = function() {
	var self = this;

	if (self.connected) {
		var bot = self.client.user;
		var rotationItem = self.rotationItem;
		var rotationInfo = self.rotationInfo[rotationItem];
		var status = "";

		switch (rotationInfo[0]) {
			case "$":
				switch(rotationInfo.slice(1)) {
					case "uptime":
						var min = Math.ceil(process.uptime()/60);
						var hr = Math.floor(min/60);
						status = hr+"H:"+min%60+"M"
						break;
				}
				break;
			default:
				status = rotationInfo;
		}
		bot.setGame(status);

		if (rotationItem < self.rotationInfo.length-1) {
			self.rotationItem++;
		} else {
			self.rotationItem = 0;
		}
	}
}
Bobbot.prototype.updateGuildFilter = function(guildId, replaceItem, messageChannel, thenFunction) {
	var self = this;

	return self.garner.guildInfo.updateItem('guildId', guildId, 'filter', replaceItem)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Filter.updateGuild', messageChannel);
		return false;
	});
}
Bobbot.prototype.updateGuildMusic = function(guildId, replaceItem, messageChannel, thenFunction) {
	var self = this;

	return self.garner.guildInfo.updateItem('guildId', guildId, 'music', replaceItem)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Music.updateGuild', messageChannel);
	});
}
Bobbot.prototype.updateGuildTrivia = function(guildId, replaceItem, messageChannel, thenFunction) {
	var self = this;

	return self.garner.guildInfo.updateItem('guildId', guildId, 'trivia', replaceItem)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Trivia.updateGuild', messageChannel);
	});
}
Bobbot.prototype.updateGuildGiveme = function(guildId, replaceItem, messageChannel, thenFunction) {
	var self = this;

	return self.garner.guildInfo.updateItem('guildId', guildId, 'giveme', replaceItem)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'Giveme.updateGuild', messageChannel);
	});
}
Bobbot.prototype.getGuild = function(guildId, messageChannel, thenFunction) {
	var self = this;

	return self.garner.guildInfo.searchFor('guildId', guildId, 1)
	.then(thenFunction)
	.catch(function(err) {
		catchError(err, 'GetGuild', messageChannel);
	});
};




function randomSelect(command) {
	var output = command.output;

	return (output[randomElement(output.length)]);
}

function pseudoSetSelect(command, select) {
	if (select) {
		if (command.outputArray.includes(select)) {
			return command.output[select];
		} else {
			return "Unable to find "+select;
		}
	} else {
		return command.output[command.outputArray[randomElement(command.outputArray.length)]];
	}
}

function setSelect(command, select) {
	if (select) {
		if (command.output.hasOwnProperty(select)) {
			return command.output[select];
		} else {
			return "Unable to find "+select;
		}
	} else {
		return command.fail;
	}
}

function randomElement(max) {
	return Math.floor(Math.random()*(max));
}




function catchError(err, location, messageChannel) {
	console.log(err);
	console.log(location);

	messageChannel.sendMessage('I seem to have encountered an error, please try again.');
}















function checkDMPerms(username) {
	var messages = {
		"pm": " PM | Inside PM"
	};
	var permissions = {
		"pm": '+'
	};
	var permKeys = Object.keys(permissions);

	var output = "  Permissions for "+username+"\n";

	for (var i = 0; i < permKeys.length; i++) {
		var key = permKeys[i];
		output += permissions[key]+messages[key];
		if (i != permKeys.length-1) {
			output += '\n';
		}
	}

	return output;
}

function checkTextPerms(username, perms, roles, guildAvailable) {
	var messages = {
		"owner": " Server Owner   | Owner of the Server",
		"manager": " Server Manager | User can manage Channels",
		"admin": " Server Admin   | User can manage Roles",
		"mod": " Server Mod     | User can manage Messages",
		"ban": " Ban Perm       | User can Ban others",
		"kick": " Kick Perm      | User can Kick others",
		"botAdmin": " Bot Admin      | User has 'Bobbot Admin' Role",
		"botMod": " Bot Mod        | User has 'Bobbot Mod' Role"
	};
	var permissions = {
		"owner": '-',
		"manager": '-',
		"admin": '-',
		"mod": '-',
		"ban": '-',
		"kick": '-',
		"botAdmin": '-',
		"botMod": '-'
	};
	var permKeys = Object.keys(permissions);

	// Owner
	if (perms.hasPermission('ADMINISTRATOR')) {
		permissions["owner"] = '+';
	}
	// Manager
	if (perms.hasPermission('MANAGE_CHANNELS')) {
		permissions["manager"] = '+';
	}
	// Admin
	if (perms.hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) {
		permissions["admin"] = '+';
	}
	// Mod
	if (perms.hasPermission('MANAGE_MESSAGES')) {
		permissions["mod"] = '+';
	}
	// Ban
	if (perms.hasPermission('BAN_MEMBERS')) {
		permissions["ban"] = '+';
	}
	// Kick
	if (perms.hasPermission('KICK_MEMBERS')) {
		permissions["kick"] = '+';
	}
	if (guildAvailable) {
		// Bot Admin(Just under Owner)
		if (roles.find('name', 'Bobbot Admin') || roles.find('name', 'bobbot Admin') || roles.find('name', 'Bobbot admin') || roles.find('name', 'bobbot admin')) {
			permissions["botAdmin"] = '+';
		}
		// Bot Mod
		if (roles.find('name', 'Bobbot Mod') || roles.find('name', 'bobbot Mod') || roles.find('name', 'Bobbot mod') || roles.find('name', 'bobbot mod')) {
			permissions["botMod"] = '+';
		}
	}

	var output = "  Permissions for "+username+"\n";

	for (var i = 0; i < permKeys.length; i++) {
		var key = permKeys[i];
		output += permissions[key]+messages[key];
		if (i != permKeys.length-1) {
			output += '\n';
		}
	}

	return output;
}

function builtInCommand(name, run) {
	this.name = name;
	this.run = run;
}

module.exports = Bobbot;