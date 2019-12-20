var exports = module.exports = {};

const fs = require("fs");
const config = require("../config.json");
const botDataJson = require("./../botData.json");
const botCommands = require("./bot-commands.json");
// Delete this line when you´re using this project for public usages.
const prv_config = require("../private_config.json");
const now = require("performance-now");
const chalk = require('chalk');
const capcon = require('capture-console');

const app = require("../api/app");
const util = require("./utils");
const clientMethod = require('./clientMethods');

const client = clientMethod.client;

const commandPrefix = config.prefix;

// Executed when the bot is ready!
client.on('ready', () => {

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
    console.log('>> Current status: ' + botDataJson.bot_status);

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
    app.startApp(client);
});

// If your code editor says that () => is an error, change it to function()
// Executed when message event
client.on('message', async(message) => {
    let commands = botCommands;
    if(message.author.bot) return;

    let sender = message.author;
    let senderUsername = sender.username;
    let senderID = sender.id;
    let content = message.content;

    if(message.channel.type === "dm"){
        let time = Date.now();
        app.dmNotification(senderUsername, content, time);
    }

    if(!message.content.startsWith(commandPrefix)) return;
    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(commandPrefix.length);

    let args = message.content.split(" ").slice(1);

    if(command === "help"){
        app.addLog({
            "log_type": "info",
            "log_message": "Command help executed!",
            "log_date": Date.now(),
            "log_action": commandPrefix + "help executed"
        });
        message.channel.send("This is the help command!");
    }

    if(command === "test"){
        app.addLog({
            "log_type": "info",
            "log_message": "Command test executed!",
            "log_date": Date.now(),
            "log_action": commandPrefix + "test executed"
        });
        message.channel.send("This is the test command for something you want to test (I think)!");
    }


    if(command === "invites"){
        /* invites.then(function (a) {
            console.log(a.filter(invite => !invite.maxAge).first().toString());
        }); */
        try {
            const invites = await message.guild.fetchInvites();
            message.author.send(invites.filter(invite => !invite.maxAge).first().toString());
        } catch(err){
            message.delete();
            message.author.send("No invite link found! Create one yourself in Discord.")
        }
    }
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