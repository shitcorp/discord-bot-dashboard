const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./../config.json");
const app = require("./app");
// const express = require('express');


const commandPrefix = config.prefix;

client.on('ready', () => {
    console.log('>> Bot is ready!');
    console.log('>> Logged in as ' + client.user.username);
    console.log('>> Running on version ' + config.bot_version);
    client.user.setGame(config.bot_game);

    app.startApp(client);
});


client.login(config.token);