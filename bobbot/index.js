/* Bob_Bot: MewBot V1.0.0
 * 
 * Currently supports connection to MongoDB to store channel stuff
 * Mods are stored, however it can not at this point use the /mod commands. A possible way to fix this is to use the commands that are sent with each message.
 * 
 * All timer commands have been temporarily depercated until I see a reason to have them brought back
 * Chats have been limited to a maximum of 15 per second and all normal messages form bobbot are now handled through a queue system rather then directly sent.
 * 
 * All channels are handled through their own object and each object is held in memory and stored to MongoDB once an hour or when closed.
 * 
 * Once a second and a tenth pass the bot attempts to send as many of the queued message as it can, up until it hit the max of 15.
 * 
 * If you send more then 20 chats or commands a second you will get banned for 8 hours, 100/sec for mods
 * 
 * All elevated users have OP, User-Tag is required to know level
 * 
 * 
 * CAP REQ :twitch.tv/membership
 * 
 * NAMES:
 > :twitch_username.tmi.twitch.tv 353 twitch_username = #channel :twitch_username user2 user3
 > :twitch_username.tmi.twitch.tv 366 twitch_username #channel :End of /NAMES list
 * Lists names of those currently in chat upon join
 * 
 * JOIN:
 > :twitch_username!twitch_username@twitch_username.tmi.twitch.tv JOIN #channel
 * Sent upon a Join
 * 
 * PART:
 > :twitch_username!twitch_username@twitch_username.tmi.twitch.tv PART #channel
 * Sent upon a Part
 * 
 * MODE:
 > :jtv MODE #channel +o operator_user
 * Sent upon gain/loss of operator
 * 
 * 
 * CAP REQ :twitch.tv/commands
 * 
 * NOTICE:
 > @msg-id=slow_off :tmi.twitch.tv NOTICE #channel :This room is no longer in slow mode.
 * Has a msg-id, general state changed and feedback(like a ban)
 * 
 * HOSTTARGET:
 > :tmi.twitch.tv HOSTTARGET #hosting_channel :target_channel [number]
 > :tmi.twitch.tv HOSTTARGET #hosting_channel :- [number]
 * Sent when host starts or ends
 * 
 * CLEARCHAT:
 * :tmi.twitch.tv CLEARCHAT #channel :twitch_username
 * Send on timeout(with username) or when chat is cleared
 * 
 * USERSTATE:
 * Use with the TAG
 * 
 * ROOMSTATE:
 * Use with the TAG
 * 
 * 
 * CAP REQ :twitch.tv/tags
 * 
 * PRIVMSG:
 > @color=#0D4200;display-name=TWITCH_UserNaME;emotes=25:0-4,12-16/1902:6-10;subscriber=0;turbo=1;user-type=global_mod :twitch_username!twitch_username@twitch_username.tmi.twitch.tv PRIVMSG #channel :Kappa Keepo Kappa
 * Channel owner can have any user-type(including empty); User state is Empty, mod, global_mod, admin, or staff
 * 
 * USERSTATE:
 > @color=#0D4200;display-name=TWITCH_UserNaME;emote-sets=0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239;subscriber=1;turbo=1;user-type=staff :tmi.twitch.tv USERSTATE #channel
 * emote-sets always contains at least 0
 * Other tags shared with PRIVMSG
 * 
 * GLOBALUSERSTATE:
 * Used in future to describe non channel-specific info
 * 
 * ROOMSTATE:
 > @broadcaster-lang=;r9k=0;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #channel
 > @slow=10 :tmi.twitch.tv ROOMSTATE #channel
 * Sent when joining a channel
 * Contains all STATE information for the channel
 * 
 */

"use strict"

var irc = require("irc");
var mongodb = require('mongodb');
require('String.prototype.startsWith');

process.title = "Bobbot";

var bobbot = new Bobbot();

bobbot.ini();

function Bobbot() {
	// Primary variables
	this.channels = {};
	this.maxChatsPerSec = 15;
	this.chatsThisSecond = 0;
	this.queuedChats = [];

	// Primary Functions
	var self = this;

	this.ini = function() {
		var channels = [];

		for (var x = 0; x < channels.length; x++) {
			self.channels[channels[x]] = new Channel(channels[x]);
			self.channels[channels[x]].pull();
		}
		self.channels["global"] = new Channel("global");
		self.channels["global"].pull();

		// Normal Chat: "irc.twitch.tv"
		// Group Chat: "192.16.64.180"
		self.client = new irc.Client("irc.twitch.tv", "BOTNAME", {userName: "BOTNAME", autoRejoin: true, channels: [], sasl: true, password: "oauth:1234567890abcdefghijklmnopqrst"});

		queueMessage("raw", "CAP REQ :twitch.tv/membership");
		queueMessage("raw", "CAP REQ :twitch.tv/commands");

		self.client.addListener('error', function(message) {
		    console.log('error: ', message);
		});

		self.client.addListener('message', function (username, channel, message) {
		    self.message(username, channel, message);
		});

		self.client.addListener("raw", function(message) {
			if (message.rawCommand == "353") {
				console.log(message.args);
			}
			if (message.rawCommand == "MODE") {
				if (message.args[1] == "+o") {
					console.log("Added Mod");
					self.channels[message.args[0]].addMod(message.args[2]);
				}
			}
		});

	}

	// Message Parser
	// This is the main command that runs everything
	this.message = function(username, channel, message) {
		if (message.startsWith("!")) {
			var command = message.split(" ");
			var commandName = command.shift().replace(/(\!+)/, "").toLowerCase();
			if (self.channels[channel].testMod(username) || self.channels["global"].testMod(username)) {
				switch(commandName) {
					default:
						break;
					case "addcommand":
						var name = command.shift()
						if (!self.channels[channel].testCommand(name)) {
							self.channels[channel].addCommand(name, command)
							self.queueMessage(channel, "Command "+name+" Created!");
						} else {
							self.queueMessage(channel, "The specified command exists!");
						}
						break;
					case "delcommand":
						var name = command.shift();
						if (self.channels[channel].testCommand(name)) {
							self.channels[channel].deleteCommand(name);
							self.queueMessage(channel, "Command "+name+" Deleted!");
						} else {
							self.queueMessage(channel, "The command "+name+" doesn't exist!");
						}
						break;
					case "deletecommand":
						self.queueMessage("This command has been depercated!/nPlease use !delcommand");
						break;
					case "editcommand":
						var name = command.shift();
						if (self.channels[channel].testCommand(name)) {
							self.channels[channel].modifyCommand(name, command);
							self.queueMessage(channel, "Command "+name+" Edited!");
						} else {
							self.queueMessage(channel, "The command "+name+" doesn't exist!");
						}
						break;
					case "addtimer":
						self.queueMessage(channel, "Command is depercated, please ask Bob620 if you want it added back. Sorry for any inconveniences!");
						break;
					case "edittimer":
						self.queueMessage(channel, "Command is depercated, please ask Bob620 if you want it added back. Sorry for any inconveniences!");
						break;
					case "deltimer":
						self.queueMessage(channel, "Command is depercated, please ask Bob620 if you want it added back. Sorry for any inconveniences!");
						break;
					case "deletetimer":
						self.queueMessage(channel, "Command is depercated, please ask Bob620 if you want it added back. Sorry for any inconveniences!");
						break;
					case "timers":
						self.queueMessage(channel, "Command is depercated, please ask Bob620 if you want it added back. Sorry for any inconveniences!");
						break;
					case "caster":
						self.queueMessage(channel, "Follow this fabulous person! www.twitch.tv/"+command[0]);
						break;
				}
			}
			switch(commandName) {
				case "":
					break;
				case "commands":
					var commands = [];
					var chanCommands = self.channels[channel].listCommands();
					if (!chanCommands) {
					} else {
						for (var x = 0; x < chanCommands.length; x++) {
							commands.push(chanCommands[x]);
						}
					}
					var globals = self.channels["global"].listCommands();
					if (!globals) {
					} else {
						for (var x = 0; x < globals.length; x++) {
							commands.push(globals[x]);
						}
					}
					if (!commands) {
						self.queueMessage(channel, "There are no commands on this channel!");
					} else {
						self.queueMessage(channel, "The commands on this channel are: "+commands.join(", "));
					}
					break;
				case "assist":
						self.queueMessage(channel, "!songrequest "+command.join(" "));
					break;
				case "request":
						self.queueMessage(channel, "!songrequest "+command.join(" "));
					break;
				default:
					if (self.channels[channel].testCommand(commandName)) {
						self.queueMessage(channel, self.channels[channel].callCommand(commandName));
					} else if (self.channels["global"].testCommand(commandName)) {
						self.queueMessage(channel, self.channels["global"].callCommand(commandName));
					}
					break;
			}
		}
	}

	this.error = function(err, channel) {
		console.log(err);
		if (channel) {
			self.queueMessage(channel, err);
		}
	}

	this.sendMessage = function(channel, output) {
		if (self.chatsThisSecond < self.maxChatsPerSec) {
			self.client.say(channel, output);
			self.chatsThisSecond++;
		} else {
			self.chatsToSend.push({"channel": channel, "output": output});
		}
	}

	this.sendRaw = function(output) {
		if (self.chatsThisSecond < self.maxChatsPerSec) {
			self.client.send(output, "", "", "");
			self.chatsThisSecond++;
		} else {
			self.chatsToSend.push({"channel": "raw", "output": output});
		}
		
	}

	this.exitHandler = function() {
		console.log("-------CLOSING-------");
		console.log("---PUSHING CHANNEL---");
		self.pushChannels();
		console.log("--FINISHING ACTIONS--");
		process.exit();
	}

	this.pushChannels = function() {
		var chanKeys = Object.keys(self.channels);
		for (var x = 0; x < chanKeys.length; x++) {
			self.channels[chanKeys[x]].push();
		}
	}

	setInterval(function() {
		self.pushChannels();
	}, 360000);

	setInterval(function() {
		self.chatsThisSecond = 0;
		if (self.queuedChats != []) {
			for (var x = 0; x < self.queuedChats.length; x++) {
				if (self.chatsThisSecond < self.maxChatsPerSec) {
					var chat = self.queuedChats.shift();
					if (chat.chatroom == "raw") {
						self.sendRaw(chat.output);
					} else {
						self.sendMessage(chat.chatroom, chat.output);
					}
				}
			}
		}
	}, 1100);

	process.stdin.on("data", function (text) {
		if (text === "quit\n") {
			self.exitHandler()
		}
		if (text == "push\n") {
			self.pushChannels();
		}
		if (text == "mods\n") {
			self.requestMods();
		}
	});

	// THIS DOES NOT WORK!!
	this.requestMods = function() {
		self.client.send("NAMES", "", "", "");
	}

	this.queueMessage = function(channel, output) {
		if (self.queuedChats = []) {
			if (self.chatsThisSecond < self.maxChatsPerSec) {
				if (channel == "raw") {
					self.sendRaw(output);
				} else {
					self.sendMessage(channel, output);
				}
			} else {
				self.queuedChats.push({"channel": channel, "output": output});
			}
		} else {
			self.queuedChats.push({"channel": channel, "output": output});
		}
	}

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///           ///  ///////  //////     //////   //////  ///   //////  ///           ///  /////////////////////////////////////////////////////////////
///  ////////////  ///////  /////  ///  /////    /////  ///    /////  ///  ////////////  /////////////////////////////////////////////////////////////
///  ////////////  ///////  /////  ///  /////  /  ////  ///  /  ////  ///  ////////////  /////////////////////////////////////////////////////////////
///  ////////////  ///////  ////  /////  ////  //  ///  ///  //  ///  ///  ////////////  /////////////////////////////////////////////////////////////
///  ////////////           ////         ////  //  ///  ///  ///  //  ///         /////  /////////////////////////////////////////////////////////////
///  ////////////  ///////  ////  /////  ////  ///  //  ///  ////  /  ///  ////////////  /////////////////////////////////////////////////////////////
///  ////////////  ///////  ///  ///////  ///  ////  /  ///  /////    ///  ////////////  /////////////////////////////////////////////////////////////
///  ////////////  ///////  ///  ///////  ///  /////    ///  //////   ///  ////////////  /////////////////////////////////////////////////////////////
///           ///  ///////  ///  ///////  ///  //////   ///  ///////  ///           ///           ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Channel Object
function Channel(channelName, mods, commands) {
	// Variables
	this.channelName = channelName;
	this.mods = [];
	this.commands = {};
	this.uri = "MongoDB";
	var self = this;

	/* Add a Command
	 * Requires name and output
	 * name = string
	 * output = string
	 * Handle "!" before name outside of this object!
	 */
	this.addCommand = function(name, output) {
		if (!self.commands.hasOwnProperty(name)) {
			self.commands[name] = output;
			return true;
		} else {
			return false;
		}
	}

	/* Add a Mod
	 * Requires name
	 * name = string
	 */
	this.addMod = function(name) {
		if (self.mods.indexOf(name) == -1) {
			self.mods.push(name);
			return true;
		} else {
			return false;
		}
	}

	/* Attempt to call a Command
	 * Requires name
	 * name = string
	 * Handle "!" before name outside of this object!
	 */
	this.callCommand = function(name) {
		if (self.commands.hasOwnProperty(name)) {
			return self.commands[name];
		} else {
			return false;
		}
	}

	/* Delete a Command
	 * Requires name
	 * name = string
	 * Handle "!" before name outside of this object!
	 */
	this.deleteCommand = function(name) {
		if (self.commands.hasOwnProperty(name)) {
			delete self.commands[name];
			return true;
		} else {
			return false;
		}
	}

	/* Delete a Mod
	 * Requires name
	 * name = string
	 */
	this.deleteMod = function(name) {
		if (self.mods.indexOf(name) != -1) {
			self.mods.pop(self.mods.indexOf(name));
			return true;
		} else {
			return false;
		}
	}

	/* List the commands
	 * Requires nothing
	 */
	this.listCommands = function() {
		if (Object.getOwnPropertyNames(self.commands).length == 0) {
			return false;
		} else {
			return Object.getOwnPropertyNames(self.commands);
		}
	}	

	/* Modify a Command
	 * Requires name and output
	 * name = string
	 * output = string
	 * Handle "!" before name outside of this object!
	 */
	this.modifyCommand = function(name, output) {
		if (self.commands.hasOwnProperty(name)) {
			self.commands[name] = output;
			return true;
		} else {
			return false;
		}
	}

	/* Test if name is a Command
	 * Requires name
	 * name = string
	 * Handle "!" before name outside of this object!
	 */
	this.testCommand = function(name) {
		if (self.commands.hasOwnProperty(name)) {
			return true;
		} else {
			return false
		}
	}

	/* Test if name is a mod
	 * Requires name
	 * name = string
	 */
	this.testMod = function(name) {
		for (var x = 0; x < self.mods.length; x++) {
			if (self.mods[x] == name) {
				return true;
			}
		}
		return false;
	}

	/* Push mods and commands to Mongo
	 * Requires nothing
	 */
	this.push = function() {

		// Mongo Connection
		mongodb.MongoClient.connect(self.uri, {server: {auto_reconnect: true}}, function(err, db) {
			if (err) throw err;
			db.collection('channels').update(
				{"name": self.channelName},
				{$set: {
					"commands": self.commands,
					"mods": self.mods
				}}
			);
		});
	}

	/* Pull mods and Commands from Mongo
	 * Requires nothing
	 */
	this.pull = function() {
		var doc = {};

		// Mongo Connection
		mongodb.MongoClient.connect(self.uri, {server: {auto_reconnect: true}}, function(err, db) {
			if (err) throw err;
			db.collection('channels').find({"name": self.channelName}).toArray(function(err, doc) {
				if (err) throw err;
				try {
					self.updateMods(doc[0].mods);
					self.updateCommand(doc[0].commands);
					console.log(self.channelName);
					console.log(doc[0]);
				} catch (err) {
					db.collection('channels').insert([
						{"mods" : [], "commands": {}, "name": self.channelName}
					], function() {
					});
				}
			});
		});
	}

	this.updateMods = function(mods) {
		if (self.mods = []) {
			self.mods = mods;
			console.log(self.mods);
		}
	}

	this.updateCommand = function(commands) {
		var keys = Object.keys(commands);
		for (var x = 0; x < keys.length; x++) {
			if (!self.testCommand(keys[x])) {
				self.commands[keys[x]] = commands[keys[x]];
			}
		}
		console.log(self.commands);
	}
}

// do something when app is closing
//process.on('exit', bobbot.exitHandler);

// catches ctrl+c event
//process.on('SIGINT', bobbot.exitHandler);

// catches uncaught exceptions
//process.on('uncaughtException', bobbot.exitHandler);