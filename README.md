# discord-bot-dashboard

###
* Downloading (coming soon)
* [Welcome](https://github.com/julianYaman/discord-bot-dashboard#welcome)
* [**Important Information**](https://github.com/julianYaman/discord-bot-dashboard#important-information)
* [Dependencies](https://github.com/julianYaman/discord-bot-dashboard#dependencies)
##

## Welcome

Welcome to this new project.

In this project, I develop a Dashboard Tool for developers which are using Discord.js for their bots. 

You can use this for projects where you are releasing new bots for public and want to manage them, for example, to give the Discord server administrators a status update on the game status like when you're down for maintenance.

**Important: Install all dependencies with ``npm install``!**

To run this project, run the command `npm start`.
It will automatically listen to the _port 3000_.

**In the `main.js` file, you can develop your bot or paste your current code!**

When you want to change the port for listening, you can change it in the `config.json`.

Write your bot token from [**the Discord Applications Page**](https://discordapp.com/developers/applications/me) into 
`config.json` inside the property value of `token`. Before you do this, look at the **Important Information** section.

## Important Information:

**api/main.js:**

```
Currently:

client.login(prv_config.token);

--------------------------------

Use this when you fork this project and want to make a pull request.
You must create the file private_config.json in the main directory (same as config.json).

private_config.json will be blocked by .gitignore from committing and pushing.


When you're making a pull request, check that you didn't write your token 
inside config.json.

--------------------------------

Change it to:

client.login(config.token);

for public usage and write your bot token inside config.json.

```

For more information: _Read the comments above the client.login function in main.js_

