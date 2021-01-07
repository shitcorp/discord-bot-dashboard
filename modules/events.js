const broadcast = require("./app").event;

module.exports = (client) => {
    client.on("guildCreate", (guild) => {
        broadcast("guild update", client.guilds.cache.size);
    });
    client.on("guildDelete", (guild) => {
        broadcast("guild update", client.guilds.cache.size);
    });
};
