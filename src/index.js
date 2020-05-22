// Add snyk.io
// https://nodesource.com/blog/nine-security-tips-to-keep-express-from-getting-pwned

/**
 * To get started with using this in your own project please see {@tutorial getting-started}
 * @fileOverview The main entrypoint for the package
 */

/**
 * The Dashboard of the bot.
 * @class
 */
class Dashboard {

    /**
     * @typedef {Object} DashboardConfig
     * @property {String} clientSecret The secret of the Discord Bot
     * @property {String} [redirectURI] The redirect URI for oAuth/signing into the dashboard
     * @property {Number} [port=8080] The port of the dashboard
     * @property {Boolean} [ssl=false] Tells the dashboard to use options for SSL. Please note that to use SSL a Reverse Proxy like NGINX is required.
     * @property {String} [reverseProxyIp=127.0.0.1] Only worry about this if SSL if set to "true". This is the ip of the Reverse Proxy you are uisng for SSL.
     * @property {String|Array<String>} [ownerID] The id(s) of the bot own/admins
     * @property {Boolean} [maintenanceNotification=false] Whether to send a notification that the bot in under maintenance
     * @property {String} [baseGame=!help | v0.0.6.3] The base game displayed by the bot
     * @property {String} [baseBotStatus=online] The status of the bot. Ex: "online", "offline", "idle", "dnd"
     * @property {String} [maintenanceGame=Bot is in maintenance] The game of the bot when set to "maintenance mode"
     * @property {String} [maintenanceStatus=dnd] The status of the bot when in maintenance. Ex: "online", "offline", "idle", "dnd"
     */

    /**
     * @param {Object} client Disocrd.js Client object.
     * @param {DashboardConfig} config Config object
     * @param {Object} [oAuth]
     */
    constructor (client, config, oAuth) {
        /**
         * See {@link validate}
         */
        Validate(client, config);

        /**
         * Disocrd.js Client object.
         * @type {Object}
         */
        this.client = client;

        /**
         * The config items for the Dashboard.
         * @type {DashboardConfig}
         */
        this.config = {
            //Required Config Items:
            clientSecret: /*oAuth.secret ||*/ config.clientSecret,
            redirectURI: config.redirectURI || CreateRedirectURI(this.port, this.hostName),

            //Not required config items
            port: config.port || 8080,

            ssl: config.ssl || false,
            reverseProxyIp: config.reverseProxyIp || "127.0.0.1",

            ownerID: config.ownerID,

            maintenanceNotification: config.maintenanceNotification || false,

            baseGame: config.baseGame || "!help | v0.0.6.3",
            baseBotStatus: config.baseBotStatus || "online",

            maintenanceGame: config.maintenanceGame || "Bot is in maintenance",
            maintenanceStatus: config.maintenanceStatus || "dnd",
        };

        if (config.owner) {
			client.once('ready', () => {
				if(options.owner instanceof Array) {
					for(const owner of options.owner) {
						client.users.fetch(owner).catch(err => {
							this.emit('warn', `Unable to fetch owner ${owner}.`);
							this.emit('error', err);
						});
					}
				} else {
					client.users.fetch(options.owner).catch(err => {
						this.emit('warn', `Unable to fetch owner ${options.owner}.`);
						this.emit('error', err);
					});
				}
			});
		}
    }

    /**
     * Used to run the Dashboard.
     * @property {Function} run Used to run the dashbaord and all of the necessary processes
     * @returns {Promise} Promise object.
     * @example
     * //"client" is a constructed Discord.js Client
     * const Dashboard = require("discord-bot-dashboard");
     * 
     * const dashbaord = new Dashboard(client, {
     *      clientSecret: your_client_secrect
     * });
     * 
     * client.on('ready', () => {
     *      dashboard.run();
     * });
     * //...
     */
    run () {
        const client = this.client;
        const config = this.config;

        return new Promise((resolve, reject) => {
            try {
                require('./server').run(client, config); //Runs webserver

                require("./events")(client); //Runs live bot stats using events

                // if (config.enableLogs) {
                //     require("./modules/resourceCheck")(config.logFolderPath); //Runs resource logging for stats in dashbaord
                // }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Sets better-sqlite3 as the SQLite provider used to store all data
     * @param {Object} db The object that serves as the connection to the database file.
     * @requires better-sqlite3
     * @returns {Promise}
     */
    SQLiteProvider (db) {
        if (!db) throw new Error("Database file not specified for dashboard");
        if (!db.name) throw new Error("Are you sure you are using \"better-sqlite3\" and/or specifed the database file?");

        //...
        //Will handle rest of databse stuff
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

/**
 * Used to check the values passed to the Dashboard constructor
 * @param {Object} client Client object from Discord.js
 * @param {DashboardConfig} config Config object with config items
 * @returns {Void}
 * @private
 */
function Validate (client, config) {
    //Check client
    if (!client) throw new Error("Client must be specified");
    if (typeof client !== "object") throw new Error("Client must Client object from Discord.js");

    //Check config type
    if (typeof config !== "object") throw new Error("The config must be an object");

    //Check for and type of required config items
    if (!config.clientSecret) throw new Error("The config item 'clientSecret' must be specified");
    if (typeof config.clientSecret !== "string") throw new Error("The config item 'clientSecret' must be a string");

    //Check datatypes for rest of config items
    if (config.port && typeof config.port !== "number") throw new TypeError("The config item 'port' must be a number");
    if (config.ssl && typeof config.ssl !== "boolean") throw new TypeError("The config item 'ssl' must be a boolean");
    if (config.reverseProxyIp && typeof config.reverseProxyIp !== "string") throw new TypeError("The config item 'reverseProxyIp' must be a boolean");
    if (config.ownerID && typeof config.ownerID !== "string" && typeof config.ownerID !== "array") throw new TypeError("The config item 'ownerID' must be a string, or an array of strings");
    if (config.maintenanceNotification && typeof config.maintenanceNotification !== "boolean") throw new TypeError("The config item 'maintenanceNotification' must be a string");
    if (config.baseGame && typeof config.baseGame !== "string") throw new TypeError("The config item 'baseGame' must be a string");
    if (config.baseBotStatus && typeof config.baseBotStatus !== "string") throw new TypeError("The config item 'baseBotStatus' must be a string");
    if (config.maintenanceGame && typeof config.maintenanceGame !== "string") throw new TypeError("The config item 'maintenanceGame' must be a string");
    if (config.maintenanceStatus && typeof config.maintenanceStatus !== "string") throw new TypeError("The config item 'maintenanceStatus' must be a string");
    if (config.redirectURI && typeof config.redirectURI !== "string") throw new TypeError("The config item 'redirectURI' must be a string");

}

/**
 * Used to generate the redirect URI
 * @param {Number} port 
 * @param {String} hostName
 * @returns {String} The redirect URI
 */
function CreateRedirectURI (port = 8080, hostName = "localhost") {
    return `http://${hostName}:${port}/auth/discord/callback`;
}

/*module.exports = {
    Dashboard,
    CreateRedirectURI
};*/
module.exports = Dashboard
