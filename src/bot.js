// General Modules
const fs = require('fs');
const Server = require('./util/server.js');

// Servers
const Discord = require('discord.js');
const Chata = require('chata-client');

// Modules for Domain Use
const Random = require('random-js');
const kitsu = require('node-kitsu');
const FlakeId = require('flake-idgen');
const intformat = require('biguint-format')
const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const UploadStream = require('s3-stream-upload');
const request = require('request');
const zlib = require('zlib');

// Waifu Storage
const dynamodbWestTwo = new aws.DynamoDB({apiVersion: '2012-08-10', 'region': 'us-west-2'});
// nlp Storage
const dynamodbEastOne = new aws.DynamoDB({apiVersion: '2012-08-10', 'region': 'us-east-1'});

// Webserver Imports
const WebServer = require('./util/webserver.js');
const express = require('express');

// Bot options
const options = {
  domains: `${__dirname}/domains`
}

// Main bot class
class Bot {
  constructor({webserver: webserverOptions = {active: false, port: 3063}, discordToken: discordToken = false, chataToken: chataToken = false}) {
    // Create the modules and servers lists
    this.modules = {};
    this.servers = {};

    // Creates the webserver using a new express instance
    this.modules.webserver = new WebServer(webserverOptions, express());

    // If there is a login token, login to the service
    // Supports discord and chata(1.0)
    if (discordToken) {
      // Use sequential(default) and create a discord server in the server list
      this.servers['discord'] = new Server('discord', new Discord.Client({apiRequestMethod: 'sequential'}));
      this.servers.discord.login(discordToken);
    }
    if (chataToken) {
      // Creates a new chata server in the server list for toka
      this.servers['toka'] = new Server('chata', new Chata());
      this.servers.toka.login(chataToken);
    }

    // If there are servers, start the bot, else throw an error
    if (Object.keys(this.servers).length > 0) {
      // Require in all modules and put them in a centeral accessible area
      // UUID and Random modules
      this.modules.random = new Random(Random.engines.mt19937().autoSeed());
      this.modules.flakeId = new FlakeId();
      this.modules.intformat = intformat;
      // Internet API Modules
      this.modules.kitsu = kitsu;
      this.modules.request = request;
      // AWS modules
      this.modules.s3 = s3;
      this.modules.dynamodbEastOne = dynamodbEastOne;
      this.modules.dynamodbWestTwo = dynamodbWestTwo;
      this.modules.uploadStream = UploadStream;
      this.modules.gzip = zlib.createGzip();

      // Creates a new list of the avalible domains, creates the domains, then starts them
      this.domains = [];
      this.createDomains();
      this.startDomains();

      // Opens the webserver if able
      this.openWebserver();

    } else {
      throw 'A Bot Token is required.';
    }
  }

  /**
   * Function used to create the underlying domains
   */
  createDomains() {
    // Search ./domains
    const files = fs.readdirSync(options.domains);
    files.forEach((file) => {
      const Domain = require(`${options.domains}/${file}/${file}.js`);
      this.domains.push(new Domain());
    });
  }

  /**
   * Function to begin/reset the underlying domains
   */
  startDomains() {
    this.domains.forEach((domain) => {
      // Creates a new server with modules refrence
      let info = {server: false, modules: this.modules};
      const serverType = domain.serverType;

      // Checks for the existing server type and sets the corresponding server
      // Throws error if unable to create the new domain
      if (this.servers.hasOwnProperty(serverType)) {
        info.server = this.servers[serverType];
      } else {
        console.warn(`Couldn't find the requested domain server: ${serverType}`);
      }

      // Starts the new domain
      if (info.server) {
        domain.start(info);
      }
    });
  }

  openWebserver() {
    // Checks for an avalible webserver and opens it
    if (this.modules.webserver) {
      this.modules.webserver.open();
    }
  }
}

module.exports = Bot;
