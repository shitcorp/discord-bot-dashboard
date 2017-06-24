var exports = module.exports = {};

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./../config.json");

// You can delete this line when you are forking this project
const prv_config = require("./../private_config.json");

const app = require("./app");

const commandPrefix = config.prefix;

client.on('ready', () => {
    // Console output for showing that the bot is running.
    console.log('\n>> Bot is ready!');
    console.log('>> Logged in as ' + client.user.username);
    console.log('>> Running on version ' + config.bot_version);

    // Optional start options when you´re starting the bot.
    client.user.setGame(config.bot_game);

    client.user.setStatus(config.bot_status);

    // This is starting the app.
    app.startApp(client);
});

// Change it to config.token
// prv_config is only for personal usage when you don´t want that others have your token!
// To use prv_config, create a file called "private_config.json" inside the main directory.
// .gitignore will ignore this file when you want to commit and push.
client.login(prv_config.token);

/**
 * @function
 * @param game - Game to be set for the bot.
 * @description Set a game status for the bot.
 * @since 0.0.1
 */
exports.setGameStatus = function (/**String*/ game) {
    client.user.setGame(game);
    console.log("\n>> Bot Change > Game status set to: " + game);
};


/**
 * @function
 * @param status - Status of the bot.
 * @description Set a status for the bot (online | idle | dnd | invisible)
 * @since 0.0.1
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
 * @function
 * @description Returns the client object. Mainly for development.
 * @since 0.0.1
 * @returns {Object}
 */
exports.sendClientObject = function () {
  return client;
};