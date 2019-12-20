module.exports = (client, config) => {
    config = {
        port: config.port || 3000,
        maintenanceNotification: config.maintenanceNotification || false,

        baseGame: config.baseGame || "!help | v0.0.6.3",
        baseBot_status: config.baseBot_status || "online",

        maintenanceGame: config.maintenanceGame || "Bot is in maintenance",
        maintenanceBot_status: config.maintenanceBot_status || "dnd"
    };
    require('./src/discord-bot-sourcefiles/main')(client, config);
}