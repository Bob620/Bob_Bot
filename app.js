"use strict"

const Bobbot = require('./index.js');
let login;
try {
  login = require('./login.json');
} catch(err) {
  throw err;
}
const  bobbot = new Bobbot(login);
