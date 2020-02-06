//export default 
class dashboard {
    constructor (client, config, oAuth) {
        this.client = client;
        this.config = {
            port: config.port || 3000,
            maintenanceNotification: config.maintenanceNotification || false,

            baseGame: config.baseGame || "!help | v0.0.6.3",
            baseBot_status: config.baseBot_status || "online",

            maintenanceGame: config.maintenanceGame || "Bot is in maintenance",
            maintenanceBot_status: config.maintenanceBot_status || "dnd",

            clientSecret: /*oAuth.secret ||*/ config.clientSecret,
            redirectURI: config.redirectURI || "http://localhost:3000/auth/discord/callback"
        };
    }

    run () {
        require('./modules/app').run(this.client, this.config);
    }
}

module.exports = dashboard;
