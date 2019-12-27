/***
 * @fileOverview The back-end module which is running express.js
 */
const express = require('express');
const DiscordOauth2 = require("discord-oauth2");

const oauth = new DiscordOauth2();
const app = express();

// TODO: Check for security measure which need to be done before
// TODO: express-session
// TODO: better frontend lmao
// TODO: Add routing system

// Run
exports.run = (client, config) => {

  oauth.tokenRequest({
    clientId: client.user.id,
    clientSecret: config.clientSecret,

    code: "query code",
    scope: "identify",
    grantType: "authorization_code",

    redirectUri: config.redirectURI
  });

  // (only-read) Basic information about the bot
  const botInfo = {
    username: client.user.username,
    status: client.user.presence.status,
    users: client.users.size,
    guilds: client.guilds.size
  };

  /*
  * App setup
  */

  // App view
  app.set('view engine', 'pug');
  app.set('views', './src/views');

  // Asset directories
  app.use('/static', express.static('./src/dist'));
  app.use('/static', express.static('./src/plugins'));
  /*
  * Routing
  */

  // Index page
  app.get('/', (req, res) => {
    res.render('index', {botInfo: botInfo})
  });

  // Listener
  app.listen(config.port, () => {
    console.log('Application is running on port ' + config.port)
  });
};
