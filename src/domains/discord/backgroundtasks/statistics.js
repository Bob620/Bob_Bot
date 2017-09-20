const Task = require(`${__dirname}/../../../util/task.js`);
const fs = require('fs');

const options = {
  id: 'statistics'
}

const delay = 3600000;
const guildsIgnore = ['110373943822540800'];

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    // Define Variables
    this.guilds = new Statistic();
    this.users = new Statistic();
    this.totalOnlineMembers = 0;
    this.interval = null;
  }

  execute() {
    console.log('Discord - Statistics');
    this.update(this.domain.server.connection.guilds);
    const CSV = this.exportToCSV();
    fs.appendFile('statistics.csv', CSV.get('overall'), (err) => {
      err !== null ? console.log(err) : '';
    });

    // Set Interval for Further Updates
    this.createInterval();

    // WebExtention
//    const statistics = this;

    // Define Statistics based API

    this.domain.modules.webserver.addGet('/api/stats', (req, res, next) => {
      res.json({
        totalGuilds: this.guilds.size,
        totalOnlineMembers: this.totalOnlineMembers
      });
    });

    this.domain.modules.webserver.addGet('/api/guilds', (req, res, next) => {
      res.json(Array.from(this.guilds.keys()));
    });

  }

  createInterval() {
    this.interval = setTimeout(() => {
      this.update(this.domain.server.connection.guilds);
      const CSV = this.exportToCSV();
      fs.appendFile('statistics.csv', CSV.get('overall'), (err) => {
        err !== null ? console.log(err) : '';
      });
      this.createInterval();
    }, this.getNextDelay());
  }

  getNextDelay() {
    return (delay - (Date.now() % delay));
  }

  update(guilds) {
    // Clear Variables
    this.guilds = new Statistic();
    this.users = new Statistic();
    this.totalOnlineMembers = 0;

    guilds.forEach((guild) => {
      const guildId = guild.id;
      if (!guildsIgnore.includes(guildId)) {
        this.guilds.set(guildId, {users: [], bots: []});
        const guildObject = this.guilds.get(guildId);
        guild.presences.forEach((presence, userId) => {
          const member = guild.members.get(userId);
          if (member !== undefined) {
            if (!member.user.bot && userId !== this.domain.server.connection.user.id) {
              guildObject.users.push(userId);
              if (!this.users.has(userId)) {
                this.totalOnlineMembers++;
                this.users.set(userId, {guilds: [guildId]});
              } else {
                this.users.get(userId).guilds.push(guildId);
              }
            } else {
              guildObject.bots.push(userId);
            }
          }
        });
      }
    });
  }

  exportToCSV() {
    let CSV = new Map();
    const currentDate = new Date();

    let overallJson = {
      Date: `${currentDate.getUTCMonth() + 1}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()}`,
      Time: `${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()}`,
      'Total Guilds': this.guilds.size,
      'Total Online Users': this.totalOnlineMembers,
      'Max Online Users in single Guild': this.guilds.getMax('users'),
      'Min Online Users in single Guild': this.guilds.getMin('users'),
      'Mean Online Users in single Guild': this.guilds.getMean('users'),
      'Max Guilds on single Online User': this.users.getMax('guilds'),
      'Min Guilds on single Online User': this.users.getMin('guilds'),
      'Mean Guilds on single Online User': this.users.getMean('guilds')
    }
/*
    let guildJson = [];
    let userJson = [];

    this.guilds.forEach((guild, guildId) => {
      guildJson.push({
        Date: `${currentDate.getUTCMonth + 1}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear}`,
        Time: `${currentDate.getUTCHours}:${currentDate.getUTCMinutes}`,
        'Guild Id': guildId,
        'Total Online Users': guild.users.length
      });
    });

    this.users.forEach((user, userId) => {
      userJson.push({
        Date: `${currentDate.getUTCMonth + 1}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear}`,
        Time: `${currentDate.getUTCHours}:${currentDate.getUTCMinutes}`,
        'User Id': userId,
        'Total Guilds': user.guilds.length
      });
    });
*/
    CSV.set('overall', `\n${Object.values(overallJson).join(',')}`);

    return CSV;
  }

  cleanup() {
    // Remove Interval
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}

class Statistic extends Map {
  constructor(...input) {
    super(input);
  }

  getMax(attr) {
    let max = '';
    this.forEach((value) => {
      const numVal = value[attr].length;
      if (max === '') {
        max = numVal;
      } else {
        if (max < numVal) {
          max = numVal;
        }
      }
    });

    return max;
  }

  getMin(attr) {
    let min = '';
    this.forEach((value) => {
      const numVal = value[attr].length;
      if (min === '') {
        min = numVal;
      } else {
        if (min > numVal) {
          min = numVal;
        }
      }
    });

    return min;
  }

  getMean(attr) {
    let total = 0;
    this.forEach((value) => {
      total += value[attr].length;
    });

    return total/this.size;
  }
}
