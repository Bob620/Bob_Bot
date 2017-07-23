const Task = require(`${__dirname}/../../../util/task.js`);

const options = {
  id: 'counter'
}

const delay = 6000;

module.exports = class extends Task {
  constructor(domain) {
    super(domain, options);

    this.guilds = new Map();
    this.interval = null;
  }

  execute() {
    console.log('Discord - Counter');
    setInterval(() => {
      this.guilds.forEach((guild, guildId) => {
        if (guild.updated) {
          this.domain.modules.dynamodbWestTwo.getItem({TableName:"bobbotstats", Key: {id: {S: guildId}}}, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              let updatedGuild;
              if (data.Item !== undefined) {
                updatedGuild = new Guild(guildId, data.Item.totals.L, guild.totals, data.Item.history.L);
              } else {
                updatedGuild = new Guild(guildId, [], guild.totals);
              }
              guild.updated = false;
              this.domain.modules.dynamodbWestTwo.putItem({TableName:"bobbotstats", Item: updatedGuild.attributify()}, (err, data) => {
                if (err) {
                  console.log(err);
                }
              });
            }
          });
        }
      });
    }, delay);
  }

  update(guildId, taskId) {
    let guild = this.guilds.get(guildId)
    if (guild !== undefined) {
      guild.updated = true;
      const task = guild.totals.get(taskId);
      if (task !== undefined) {
        task.total++;
      } else {
        guild.totals.set(taskId, new TaskStats(taskId, 1));
      }
    } else {
      this.guilds.set(guildId, new Guild(guildId));
      guild = this.guilds.get(guildId);

      guild.updated = true;
      guild.totals.set(taskId, new TaskStats(taskId, 1));
    }
  }

  cleanup() {
    // Remove Interval
    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}

class Guild {
  constructor(guildId, totals=[], mergeTasks=new Map(), histories=[]) {
    this.id = guildId;
    this.totals = new Map();
    this.history = new Map();

    histories.forEach((historyItem) => {
      this.history.set(Number.parseInt(historyItem.M.time.N), new History(historyItem.M.time.N, historyItem.M.guildId.S, historyItem.M.data.L));
    })

    const history = this.history;
    const currentTime = Date.now();

    if (!history.has(currentTime)) {
      history.set(currentTime, new History(currentTime, guildId));
    }

    let historyData = history.get(currentTime).data;

    totals.forEach((task) => {
      const taskId = task.M.id.S;
      let increase = 0;
      let mergeTask = mergeTasks.get(taskId);

      if (mergeTask !== undefined) {
        increase = mergeTask.total;
        mergeTask.total = 0;
      }
      this.totals.set(taskId, new TaskStats(taskId, Number.parseInt(task.M.total.N)+increase));
      if (increase !== 0) {
        historyData.set(taskId, new TaskStats(taskId, increase));
      }
    });

    mergeTasks.forEach((task, taskId) => {
      const increase = task.total;

      if (increase !== 0) {
        this.totals.set(taskId, new TaskStats(taskId, increase));
        historyData.set(taskId, new TaskStats(taskId, increase));
        task.total = 0;
      }
    });
  }

  attributify() {
    let attributes = {
      id: {S: this.id},
      totals: {L: []},
      history: {L: []}
    }

    this.totals.forEach((task) => {
      attributes.totals.L.push(task.attributify());
    });

//    this.history.forEach((history) => {
//      attributes.history.L.push(history.attributify());
//    });

    return attributes;
  }
}

class TaskStats {
  constructor(id, total=0) {
    this.id = id;
    this.total = Number.parseInt(total);
  }

  attributify() {
    return {M: {
      id: {S: this.id},
      total: {N: this.total.toString()}
    }}
  }
}

class History {
  constructor(time, guildId, data=[]) {
    this.guildId = guildId;
    this.time = Number.parseInt(time);
    this.data = new Map();

    data.forEach((task) => {
      this.data.set(task.M.id.S, new TaskStats(task.M.id.S, task.M.total.N));
    })
  }

  attributify() {
    let attributes = {M: {
      guildId: {S: this.guildId},
      time: {N: this.time.toString()},
      data: {L: []}
    }}

    this.data.forEach((task) => {
      attributes.M.data.L.push(task.attributify());
    });

    return attributes;
  }
}
