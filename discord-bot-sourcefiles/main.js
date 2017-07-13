var exports = module.exports = {};

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
// Delete this line when you´re using this project for public usages.
const prv_config = require("../private_config.json");

const chalk = require('chalk');

const app = require("./../api/app");

const commandPrefix = config.prefix;

client.on('ready', () => {
    // Console output for showing that the bot is running.
    console.log(chalk.greenBright('\n>> Bot is ready!'));
    console.log('>> Logged in as ' + client.user.username);
    console.log('>> Running on version ' + config.bot_version);

    // Optional start options when you´re starting the bot.
    client.user.setGame(config.bot_game);

    client.user.setStatus(config.bot_status);

    // This is starting the app.
    app.startApp(client);
});

// Change it to config.token when you want to use this project for public usages.
//
// prv_config is only for personal usage or when youre forking this project,
// testing some functions with the and make a pull request to the repo.
// Warning: When you´re making a pull request, check that you didn´t wrote your token inside the config.json.
//
// To use prv_config, create a file called "private_config.json" inside the main directory.
// .gitignore will ignore this file when you want to commit and push.
// So nobody can get your bot token.
client.login(prv_config.token);

/**
 * Set a game status for the bot.
 *
 * @param game - Game to be set for the bot.
 * @since 0.0.1
 *
 * @public
 */
exports.setGameStatus = function (/**String*/ game) {
    client.user.setGame(game);
    console.log("\n>> Bot Change > Game status set to: " + game);
};

/**
 * Writing a message to the administrators of a server. (testing)
 *
 * @param message - Message string which will be sent to the administrator.
 * @since 0.0.2-beta
 *
 * @public
 */
exports.sendAdminMessage = function (/**String*/ message) {
    let guilds = client.guilds;

    guilds.map(function (a) {
        a.owner.send(message);
        console.log(">> Bot Action > Server Admin DM sent to: " + a.owner.user.username + " - Server Admin of the server: " + a.name);
        console.log("> Direct invite link to server: currently not available. on development.")
    })
};


/**
 * Set a status for the bot (online | idle | dnd | invisible)
 *
 * @param status - Status of the bot.
 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/PresenceStatus|Discord.js Docs -> PresenceStatus}
 * @since 0.0.1
 *
 * @public
 */
exports.setBotStatus = function (/**String*/ status) {
    if(status != "online" && status != "idle" && status != "invisible" && status != "dnd" ){
        console.error("\n>> Bot Error: Invalid status to set! Use only the 4 vaild ones!" +
            "\n>> PresenceStatus: https://discord.js.org/#/docs/main/stable/typedef/PresenceStatus" +
            "\n>> Sent value: " + status);
    }else{
        client.user.setStatus(status);
        console.log("\n>> Bot Change > Status set to: " + status);
    }
};

/**
 * Returns the client object. Mainly for development.
 *
 * @since 0.0.1
 * @return {Object} The Client object.
 *
 * @public
 */
exports.sendClientObject = function () {
  return client;
};

/**
 * Outputs the client.guilds object. Mainly for development.
 *
 * @since 0.0.3
 *
 * @public
 */
exports.sendGuildsObject = function () {
    let guilds = client.guilds;
    // guilds.map(function (a) {
    //     console.log(a.name);
    // })
    console.log(guilds);
};
/**
 * Outputs the invites of servers where the bot is connected. For production and development.
 *
 * @since 0.0.3
 *
 * @public
 */
exports.sendInvitesOfServers = function () {
    let guilds = client.guilds;

    guilds.map(function (a) {
        a.fetchInvites().then((invites) => {
            invites.map(function (b) {
                console.log(b.guild.name + " / " + b.url);
            });
        });
    })
};

/**
 * Change status from bot to 'dnd' and writes a message to the discord server admins who are using this bot to
 * get informed about the maintenance (maintenance like for testing new functions etc.) [This function is in a Early status!]
 *
 * @param maintenanceBool - Maintenance status of the bot and the app.
 * @since 0.0.4
 *
 * @public
 */
exports.maintenance = function (/**boolean*/ maintenanceBool) {
    if(maintenanceBool === true){
        this.setBotStatus("dnd");
        this.setGameStatus("Monkeys are working!");
        this.sendAdminMessage("Hello dear server admin, currently I´m currently in maintenance so don´t wonder why you may not can access all functions. We will inform you when we finished our maintenance!");
        console.log("\n>> Bot > Maintenance are now " + chalk.redBright.bold("enabled!"));
    }else{
        this.setBotStatus("online");
        this.setGameStatus("Monkeys are finished!");
        console.log("\n>> Bot > Maintenance are now " + chalk.greenBright.bold("disabled!"));
    }
};

