# discord-bot-dashboard, package edition

###
* [Welcome](https://github.com/julianYaman/discord-bot-dashboard#welcome)
* [**Important Information**](https://github.com/julianYaman/discord-bot-dashboard#important-information)
* [Dependencies](https://github.com/julianYaman/discord-bot-dashboard#dependencies)
##

## Welcome

Welcome to this new project.

In this project, I develop a Dashboard Tool for developers which are using Discord.js for their bots. 

You can use this for projects where you are releasing new bots for public and want to manage them, for example, to give the Discord server administrators a status update on the game status like when you're down for maintenance.

## Documentation
**Run the dashboard**
```js
const dashboard = require('packageName');
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

dashboard.run(client);

// Log inro the bot using the token from https://discordapp.com/developers/applications/me
client.login('Your token here');
```
A logged in client is required to be passed to the package. (Basicly just use the `.login` method on the same client var passed at some point.)

**Settings**
```js
const dashboard = require('packageName');
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

dashboard.run(client, {
    port: 3000, //Number
    maintenanceNotification: false, //Boolean

    baseGame: "!help | v0.0.6.3", //String
    baseBot_status: "online", //String

    maintenanceGame: "Bot is in maintenance", //String
    maintenanceBot_status: "dnd" //String
});

// Log inro the bot using the token from https://discordapp.com/developers/applications/me
client.login('Your token here');
```
Each setting displayed above is the default setting. No, setting is required to be entered by the user, each has a default setting.