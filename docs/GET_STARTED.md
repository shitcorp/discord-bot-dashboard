# Get Started

Welcome to the starter guide of the Discord Bot Dashboard.

This dashboard was written for bot developers who want to have a better overview of their own bot
and to have the possibility to control and analyse its behaviour.

### Creating a config file

Before using the dashboard, we recommend to use `dotenv` (if you are not already or using something like it,) and to create a `.env` file to store sensitive values like your bot's token. Here is an example `.env` file:

```dotenv
SESSION_SECRET=your_own_secret_code_for_sessions
CLIENT_SECRET=your_client_secret_code
REDIRECT_URI=your_redirect_uri
```

-   To get your **client secret**, go to:

**discordapp.com >> Developer Portal >> Your Bot >> General Information**

-   For setting up the **OAuth2 connection** and for the functionality of the login, please go to:

**(Steps before) >> Your Bot >> OAuth2**

-   Now you need to **specify a redirect URI** in the following format (it must exactly match):

```text
http://[your-domain-or-ip.com]/auth/discord/callback
```

...and now you are done with setting up the application! :)

(For ssl setup please see the [SSL.md](https://github.com/julianYaman/discord-bot-dashboard/tree/master/docs/SSL.md) file.)

### Implementing the dashboard

Now it is time to implement the dashboard into your bot project. It is very simple!

-   After setting up the `Discord.Client`, here is an example using `dotenv`:

```js
// Discord client setup
const Discord = require("discord.js");
const client = new Discord.Client();
const Dashboard = require("discord-bot-dashboard");
const token = "Your awesome discord bot token";

client.on("ready", () => {
    console.log("Hello world!");
    const dashboard = new Dashboard(client, {
        port: 8080, // Dashboard port? Number, default: 8080
        clientSecret: "Your discord bot client secret",
        redirectURI: "http://localhost:8080/auth/discord/callback",
        maintenanceNotification: false, // Maintenance notification? Boolean, default: false
        baseGame: "", // Base game? String, default: !help | v0.0.6.3,
        baseBotStatus: "", // Bot status? String, default: online
        maintenanceGame: "", // Maintenance Game? String, default: Bot is in maintenance
        maintenanceStatus: "", // Maintenance Status? String, default: dnd
        sessionSecret: "a random text (I recommend punching your keyboard))", // Session Secret? String, default: abcdefghijklmnopqrstuvwxyz1234567890!@#$%¨&*()_ABCDEFGHIJKLMNOPQRSTUVWXYZ
        websiteDomain: "http://localhost:8080",
    });
    dashboard.run();
});

client.login(token);
```

Also if you would like to see a full a working implementation of `discord-bot-dashboard` please follow [this](https://github.com/julianYaman/discord-bot-dashboard/blob/master/test.js) link.

Now the dashboard can be used! Just restart your bot and try it out! If you want more configuration options please see [CONFIG.md](https://github.com/julianYaman/discord-bot-dashboard/tree/master/docs/CONFIG.md)
