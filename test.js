/*****
 * This test file is only temporarily.
 * It is here just to test the basic functionality.
*/
const { Client } = require('discord.js');
const chalk = require('chalk');
require('dotenv').config(); // Create a .env file or include your own config file

//import run from "./index.js"; //require dashboard
const Dashboard = require("./index");

// Create an instance of a Discord client
const client = new Client();
//const oAuth = Discord.OAuth2Application;

//const { OAuth2Application } = require('discord.js');

const dashboard = new Dashboard(client, {
  port: 4000, 
  clientSecret: process.env.clientSecret, 
  redirectURI: "http://localhost:4000/auth/discord/callback"
});

// Ready event of the Client
client.on('ready', () => {
  
  dashboard.run();
  //run(client, {port: 4000, clientSecret: process.env.clientSecret, redirectURI: "http://localhost:4000/auth/discord/callback"});
  console.log('INFO >> ' + chalk.green('Bot is online'));

});

const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.on("message", message => {
  const args = message.content.split(" ").slice(1);
 
  if (message.content.startsWith(process.env.prefix + "eval")) {
    if(message.author.id !== process.env.ownerID) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 
      message.channel.send(clean(evaled), {code:"xl"});
      console.log('Eval >> ' + chalk.green(clean(evaled)));
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      console.log('Eval >> ' + chalk.green(clean(err)));
    }
  }
});


// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(process.env.TOKEN);