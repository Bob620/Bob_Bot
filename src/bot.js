// General Modules
const fs = require('fs');

// Servers
//const Garner = require('./garner.js');
const Discord = require('discord.js');
const Chata = require('chata-client');

// Modules for Server Use
//const log = require('./util/log.js');
const Random = require('random-js');
const kitsu = require('node-kitsu');
const FlakeId = require('flake-idgen');
const intformat = require('biguint-format')
const aws = require('aws-sdk');
const s3 = new aws.S3({apiVersion: '2006-03-01'});
const UploadStream = require('s3-stream-upload');
const request = require('request');
const zlib = require('zlib');
const Server = require('./util/server.js');

// Waifu Storage
const dynamodbWestTwo = new aws.DynamoDB({apiVersion: '2012-08-10', 'region': 'us-west-2'});
// nlp Storage
const dynamodbEastOne = new aws.DynamoDB({apiVersion: '2012-08-10', 'region': 'us-east-1'});

// Webserver Imports
const WebServer = require('./util/webserver.js');
const express = require('express');

const options = {
  "domains": `${__dirname}/domains`
}

class Bot {
  constructor({webserver: webserverOptions = {active: false, port: 3063}, discordToken: discordToken = false, chataToken: chataToken = false}) {
    this.modules = {};
    this.servers = {};

    this.modules.webserver = new WebServer(webserverOptions, express());

    if (discordToken) {
      this.servers["discord"] = new Server("discord", new Discord.Client({apiRequestMethod: "sequential"}));
      this.servers.discord.connection.login(discordToken);
    }
    if (chataToken) {
      this.servers["toka"] = new Server("chata", new Chata());
      this.servers.toka.connection.login(chataToken);
    }

    if (Object.keys(this.servers).length > 0) {
      this.modules.random = new Random(Random.engines.mt19937().autoSeed());
      this.modules.kitsu = kitsu;
//      this.modules.log = log;
      this.modules.flakeId = new FlakeId();
      this.modules.intformat = intformat;
      this.modules.s3 = s3;
      this.modules.dynamodbEastOne = dynamodbEastOne;
      this.modules.dynamodbWestTwo = dynamodbWestTwo;
      this.modules.uploadStream = UploadStream;
      this.modules.request = request;
      this.modules.gzip = zlib.createGzip();

      this.domains = [];
      this.createDomains();
      this.startDomains();

      this.openWebserver();

    } else {
      throw "A Bot Token is required.";
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
      let info = {"server": false, modules: this.modules};
      const serverType = domain.serverType;

      if (this.servers.hasOwnProperty(serverType)) {
        info.server = this.servers[serverType];
      } else {
        throw `Couldn't find the requested domain server ${serverType}`;
      }

      domain.start(info);
    });
  }

  openWebserver() {
    if (this.modules.webserver) {
      this.modules.webserver.open();
    }
  }
}

module.exports = Bot;
