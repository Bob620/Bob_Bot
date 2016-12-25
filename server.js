const Collection = require('./collection.js');

module.exports = function Server(garnerGuild, garner) {
    const server = {};
    const garnerGuildKeys = Object.keys(garnerGuild);
    for (let i = 0; i < garnerGuildKeys.length; i++) {
        const key = garnerGuildKeys[i];
        const item = garnerGuild[key];
        if (Array.is(item)) {
            server[key] = new Collection(item);
        } else if (Object.is(item)) {
            server[key] = item;
            // ???
            // Profit
        } else {
            server[key] = item;
        }
    }
    server.update = function(key) {
        garner.update(key, this[key]);
    }
    return server;
}
