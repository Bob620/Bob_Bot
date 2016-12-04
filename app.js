"use strict"

var Bobbot = require('./index.js');
var login = require('./login.json');

var bobbot = new Bobbot(login.clientId, login);
