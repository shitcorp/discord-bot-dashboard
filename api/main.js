const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./../config.json");
const prv_config = require("./../private_config.json")
const app = require("./app");

const commandPrefix = config.prefix;

client.on('ready', () => {
    console.log('>> Bot is ready!');
    console.log('>> Logged in as ' + client.user.username);
    console.log('>> Running on version ' + config.bot_version);
    client.user.setGame(config.bot_game);

    app.startApp(client);
});

// Change it to config.token
// prv_config is only for personal usage when you don´t want that others have your token!
// To use prv_config, create a file called "private_config.json" inside the main directory.
// .gitignore will ignore this file when you want to commit and push.
client.login(prv_config.token);