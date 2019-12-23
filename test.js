const dashboard = require("./index");
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

dashboard.run(client);

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login('TOKEN HERE');