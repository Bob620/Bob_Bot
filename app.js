"use strict"

var Bobbot = require('./BobBot.js');
try {
	var login = require('./login.json');
	var bobbot = new Bobbot(login.clientId);//, login);
} catch(err) {
	throw err;
}
