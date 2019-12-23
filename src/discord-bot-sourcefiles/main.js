var exports = module.exports = {};

const fs = require("fs");
const botDataJson = require("./../botData.json");
/*const botCommands = require("./bot-commands.json");
// Delete this line when you´re using this project for public usages.
const prv_config = require("../private_config.json");
const now = require("performance-now");
const chalk = require('chalk');
const capcon = require('capture-console');*/

const app = require("../api/app");
//const util = require("./utils");

module.exports = (client, config) => {

    // Executed when the bot is ready!
    client.on('ready', () => {

        /*
        capcon.startCapture(process.stdout, function (stdout) {
            log.push({
                message: stdout
            });
        });
        //capcon.stopCapture(process.stdout);

        // Console output for showing that the bot is running.
        console.log(chalk.greenBright('\n>> Bot is ready!'));
        console.log('>> Logged in as ' + client.user.username);
        console.log('>> Running on version ' + botDataJson.bot_version);
        console.log('>> Current game: ' + botDataJson.bot_game);
        console.log('>> Current status: ' + botDataJson.bot_status);*/

        // Optional start options when you´re starting the bot.

        client.user.setPresence({
            game: {
                name: botDataJson.bot_game,
                type: botDataJson.bot_game_type
            },
            status: botDataJson.bot_status
        });

        //console.log(client.user.presence);

        // This is starting the app.
        app.startApp(client, config);
    });
}