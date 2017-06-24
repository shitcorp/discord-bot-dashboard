# discord-bot-dashboard

Welcome to this new project.

In this project I develop a Dashboard Tool for developers which are using Discord.js for their bots. 

You can use this for projects where you are releasing new bots for public and want to manage them, for example, to give the discord server administrators a status update in the game status like when you´re having a maintenance.

To run this project, run the command `npm start`.
It will automatically listening to the port 3000.

When you want to change the port for listening, you can change it in the `config.json`.

Write your bot token from [the Discord Applications Page](https://discordapp.com/developers/applications/me) into the `config.json` inside the property value of `token`.

In the `main.js` file, you can develop your bot or paste your current code!

I´m using following npm packages as dependencies:
```
- express
- jquery
- nodemon
- discord.js
- body-parser
```