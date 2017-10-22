const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  id: 'status'
}

const delay = 15000;

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);
    this.interval = null;
    this.currentStatus = 0;
    this.statistics = this.domain.backgroundTasks.get('statistics');
    this.messages = [
      () => {
        return {
          status: 'online',
          game: {
            name: `${this.statistics.totalOnlineMembers} people online`
          }
        }
      },
      () => {
        return {
          status: 'online',
          game: {
            name: 'Version 2.1.0'
          }
        }
      },
      () => {
        return {
          status: 'online',
          game: {
            name: 'Now in Purple'
          }
        }
      },
      () => {
        return {
          status: 'online',
          game: {
            name: 'Markchi baka baka~~'
          }
        }
      },
      () => {
        return {
          status: 'online',
          game: {
            name: 'Astolfo best Waifu'
          }
        }
      }
    ];
  }

  execute() {
    console.log('Discord - Status');
    const user = this.domain.server.connection.user;

    if (this.domain.server.connected) {
      user.setPresence(this.messages[this.currentStatus]()).then(() => {}).catch((err) => {throw err});
    }
    
    this.interval = setInterval(() => {
      this.currentStatus++;
      if (this.currentStatus >= this.messages.length) {
        this.currentStatus = 0;
      }

      if (this.domain.server.connected) {
        user.setPresence(this.messages[this.currentStatus]()).then(() => {}).catch((err) => {throw err});
      }
    }, delay);
  }

  cleanup() {
    this.domain.server.connection.user.setStatus('idle').then(() => {}).catch(() => {});

    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}
