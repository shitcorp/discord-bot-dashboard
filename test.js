const dashboard = require("./index");
const Discord = require('discord.js');
require('dotenv').config() // Create a .env file or include your own config file

// Create an instance of a Discord client
const client = new Discord.Client();


client.on('ready', () => {

  dashboard.run(client, { port: 4000 })
  console.log('Bot is online')

})

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.TOKEN);