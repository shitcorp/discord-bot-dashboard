const app = require('./modules/app')

module.exports.run = (client, config, oAuth) => {

    config = {
        port: config.port || 3000,
        maintenanceNotification: config.maintenanceNotification || false,

        baseGame: config.baseGame || "!help | v0.0.6.3",
        baseBot_status: config.baseBot_status || "online",

        maintenanceGame: config.maintenanceGame || "Bot is in maintenance",
        maintenanceBot_status: config.maintenanceBot_status || "dnd",

        clientSecret: oAuth.secret || config.clientSecret,
        redirectURI: config.redirectURI || "http://localhost:3000/auth/discord/callback"
    };

    // Required: Discord.client, port (default: 3000)
    app.run(client, config)

}