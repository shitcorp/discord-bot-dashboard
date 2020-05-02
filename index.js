//export default 
class Dashboard {
    constructor (client, config, oAuth) {
        this.constructor.validate(client, config);

        this.client = client;
        this.config = {
            //Required Config Items:
            clientSecret: /*oAuth.secret ||*/ config.clientSecret,
            redirectURI: config.redirectURI,

            //Not required config items
            port: config.port || 8080,

            maintenanceNotification: config.maintenanceNotification || false,

            baseGame: config.baseGame || "!help | v0.0.6.3",
            baseBotStatus: config.baseBotStatus || "online",

            maintenanceGame: config.maintenanceGame || "Bot is in maintenance",
            maintenanceStatus: config.maintenanceStatus || "dnd",
        };
    }

    run () {
        const client = this.client;
        const config = this.config;

        return new Promise(function(resolve, reject) {
            try {
                require('./modules/app').run(client, config); //Runs webserver

                require("./modules/events")(client); //Runs live bot stats using events

                // if (config.enableLogs) {
                //     require("./modules/resourceCheck")(config.logFolderPath); //Runs resource logging for stats in dashbaord
                // }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    SQLiteProvider (db) {
        if (!db) throw new Error("Database file not specified for dashboard");
        if (!db.name) throw new Error("Are you sure you are using \"better-sqlite3\" and/or specifed the database file?");

        //...
        //Will handle rest of databse stuff
    }

    static validate (client, config) {
        //Check client
        if (!client) throw new Error("Client must be specified");

        //Check config type
        if (typeof config !== "object") throw new Error("The config must be an object");

        //Check for and type of required config items
        if (!config.clientSecret) throw new Error("The config item 'clientSecret' must be specified");
        if (typeof config.clientSecret !== "string") throw new Error("The config item 'clientSecret' must be a string");

        //Check datatypes for rest of config items
        if (config.port && typeof config.port !== "number") throw new TypeError("The config item 'port' must be a number");
        if (config.maintenanceNotification && typeof config.maintenanceNotification !== "boolean") throw new TypeError("The config item 'maintenanceNotification' must be a boolean");
        if (config.baseGame && typeof config.baseGame !== "string") throw new TypeError("The config item 'baseGame' must be a string");
        if (config.baseBotStatus && typeof config.baseBotStatus !== "string") throw new TypeError("The config item 'baseBotStatus' must be a string");
        if (config.maintenanceGame && typeof config.maintenanceGame !== "string") throw new TypeError("The config item 'maintenanceGame' must be a string");
        if (config.maintenanceStatus && typeof config.maintenanceStatus !== "string") throw new TypeError("The config item 'maintenanceStatus' must be a string");
        if (config.redirectURI && typeof config.redirectURI !== "string") throw new TypeError("The config item 'redirectURI' must be a string");

    }
}

function CreateRedirectURI (port = 8080, hostName = "localhost") {
    const uri  = `http://${hostName}:${port}/auth/discord/callback`;
  
    return uri;
}

/*module.exports = {
    Dashboard,
    CreateRedirectURI
};*/
module.exports = Dashboard
