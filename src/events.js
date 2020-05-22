const broadcast = require("./server").event;

/**
 * Used to detect events and push the data to the dashboard
 * @param {Object} client Disocrd.js Client object.
 */
module.exports = (client) => {
    //should probably have a system for sharded bots 
    client.on('guildCreate', guild => {
        broadcast("guild update", client.guilds.cache.size);
    });

    client.on('guildDelete', guild => {
        broadcast("guild update", client.guilds.cache.size);
    });
}