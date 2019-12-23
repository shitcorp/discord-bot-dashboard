module.exports.run = (client, config) => {
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

module.exports.addLog = (type, message, action, date) => {
    logData = {
        log_type: logData.log_type,
        log_message: logData.log_message,
        log_action: logData.log_action,
        log_date: logData.log_date || Date.now(),
    };
    require('./src/api/app').addLog(logData);
}