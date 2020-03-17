const broadcast = require("./app").event;

module.exports = (client) => {
    client.on('guildCreate', guild => {
        broadcast("guild update", client.guilds.size);
    });
}