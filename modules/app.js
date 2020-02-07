/***
 * @fileOverview The back-end module which is running express.js
 */
const express = require('express');
const passport = require("passport");
const session = require('express-session');

const DiscordStrategy = require("passport-discord.js").Strategy;
const app = express();

// Util modules
const chalk = require('chalk');
const config = require("./../config.json");
const botData = require("./../botData.json");
const bot = require("./../app");
const log = require("./../log.json");
const fs = require("fs");
const bodyParser = require('body-parser');
const now = require("performance-now");
const commands = require("./../bot-commands.json");
;

var exports = module.exports = {};

/**
 * Required for starting the web server and to load the express app.
 * Version shows the current version of this project, not of the bot.
 *
 * Last updates: {@link https://goo.gl/yDFywF Commits from master branch}
 *
 * Check out and contribute to the project {@link https://goo.gl/DVJQem on GitHub}.
 *
 * @param client - Discord.js Client Object
 * @version 0.0.6.3
 * @public
 */
// Run
exports.run = (client, config) => {
  let maintenanceStatus = botData.maintenance;
  /*
* App setup
*/

  // App view
  app.set('view engine', 'ejs');
  app.set('views', './src/views');

  // Asset directories
  app.use('/lib', express.static('lib', { redirect : false }));
  app.use('/styles', express.static('src', { redirect : false }));
  app.use('/scripts', express.static('src', { redirect : false }));
  app.use('/static', express.static('./src/dist'));
  app.use('/static', express.static('./src/plugins'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }),)
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  }));

  // passport login strategy
  passport.use(new DiscordStrategy({
        clientID: client.user.id,
        clientSecret: config.clientSecret,
        callbackURL: config.redirectURI,
        scope: ["identify"]
      },
      function(accessToken, refreshToken, profile, done) {
        //Handle Database Query Addition Here.
        //console.log(profile);
        return done(null, profile);
      }
  ));

  passport.serializeUser(function(u, d) {
    d(null, u);
  });
  passport.deserializeUser(function(u, d) {
    d(null, u);
  });

  // (only-read) Basic information about the bot
  const botInfo = {
    username: client.user.username,
    status: client.user.presence.status,
    users: client.users.size,
    version: botData.bot_version,
    guilds: client.guilds.size
  };

  function accountImage (user) {
    return `<img src="${"https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png"}" class="img-circle elevation-2" alt="User Image"></img>`
  }

  /*
  * Routing
  */
  // Index page
  app.get('/', (req, res) => {
    if (!req.session.user) {
      res.redirect('/auth/discord');
    } else {
      res.render('index', {page: "dashboard", data: client, maintenanceStatus: maintenanceStatus, botData: botData, botInfo: botInfo, userInfo: req.session.user, image: accountImage(req.session.user)});
      //res.send(`Hello ${req.session.user.username}`);
    }
  });

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    res.redirect('/auth/discord');
  } else {
    res.render('dashboard', {data: client, maintenanceStatus: maintenanceStatus, botData: botData, botInfo: botInfo, userInfo: req.session.user, image: accountImage(req.session.user)});
    //res.send(`Hello ${req.session.user.username}`);
  }
});

app.get("/messages", (req, res) => {
  if (!req.session.user) {
      res.redirect('/auth/discord');
    } else {
      res.render('messages', {data: client, maintenanceStatus: maintenanceStatus, botData: botData, botInfo: botInfo, userInfo: req.session.user, image: accountImage(req.session.user)});
}});

app.get("/outputClient", (req, res) => {
    let t0 = now();
    console.log(bot.sendClientObject(t0));
    res.redirect("/dashboard");
});

app.get("/outputGuilds", (req, res) => {
    let t0 = now();
    console.log(bot.sendGuildsObject(t0));
    res.redirect("/dashboard");
});

app.get("/log", (req, res) => {
  if (!req.session.user) {
    res.redirect('/auth/discord');
  } else {
    res.render("log", {
        data: client,
        maintenanceStatus: maintenanceStatus,
        botData: botData, 
        botInfo: botInfo, 
        userInfo: req.session.user, 
        image: accountImage(req.session.user),
        log: log
    })
}});

app.get("/manage", (req, res) => {
  if (!req.session.user) {
    res.redirect('/auth/discord');
  } else {
    res.render("manage", {
        data: client,
        maintenanceStatus: maintenanceStatus,
        log: log,
        commands: commands,
        botData: botData,
        botInfo: botInfo,
        userInfo: req.session.user,
        image: accountImage(req.session.user),
        prefix: config.prefix
    })
}});

app.get("/botStatus", (req, res) => {
    res.render("botStatus", {data: client, maintenanceStatus: maintenanceStatus});
});

app.get("/status", (req, res) => {
  if (!req.session.user) {
    res.redirect('/auth/discord');
  } else {
    res.render("botStatusPage", {data: client, maintenanceStatus: maintenanceStatus, botData: botData, botInfo: botInfo, userInfo: req.session.user, image: accountImage(req.session.user)});
}});
    app.get("/comingSoon", (req, res) => {
    res.render("coming_soon", {data: client, botData: botData});
});

app.get("/activateMaintenance", (req, res) => {
    let t0 = now();
    bot.maintenance(true, t0);
    maintenanceStatus = true;
    res.redirect("/dashboard");
});

app.get("/deactivateMaintenance", (req, res) => {
    let t0 = now();
    bot.maintenance(false, t0);
    maintenanceStatus = false;
    res.redirect("/dashboard");
});

app.get("/testingNewFunction", (req, res) => {

    // Here you´re writing the new function or calling a new function.
    bot.sendInvitesOfServers();

    res.redirect("/dashboard");
    console.log("\n>> Redirecting to /");
});

// ---- POST

app.post("/change-game-status" ,(req, res) => {

    // Using the exports function from the required "./main" module to set the game
    bot.setGameStatus(req.body.gameStatus, false, now());

    // TODO: Updating the config.json with the new bot_game value to get the new game value when restarting the bot.

    res.redirect("/dashboard");
    console.log("\n>> Redirecting to /");
});

app.post("/change-status", (req, res) => {

    bot.setBotStatus(req.body.status, false);

    res.redirect("/dashboard");
    console.log("\n>> Redirecting to /");
});

app.post("/change-ver-status" ,(req, res) => {

  // Using the exports function from the required "./main" module to set the game

  // TODO: Updating the config.json with the new bot_game value to get the new game value when restarting the bot.

  res.redirect("/dashboard");
  console.log("\n>> Redirecting to /");
});

app.post("/send-serveradmin-dm-message", (req, res) => {

    bot.sendAdminMessage(req.body.message);

    res.redirect("/messages");
    console.log("\n>> Redirecting to /messages");
});



// ---- 404 Page


  // Authorizing pages
  app.get("/auth/discord", passport.authenticate("discord.js"));
  // Callback for the Discord login
  app.get("/auth/discord/callback", passport.authenticate("discord.js", { failureRedirect: "/auth/discord/error" }), function(req, res) {
    // Accessing the user object easier
    req.session.user = req.session.passport.user;
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  });
  app.use(function (req, res, next) {
    res.status(404).render("404");
});

  // Listener
  app.listen(config.port, () => {
    console.log('INFO >> ' + chalk.green('Сайт запустился на порту ' + config.port));
  });
}
/**
 * This function sends a notification to the discord bot dashboard user
 * to get the information that a user sent a message to him.
 * This can be disabled in a future update.
 *
 * @todo Give the possibility to disable DM notifications.
 * @param user - Username from message.author which sent the DM
 * @param content - Content of the DM.
 * @param timestamp - Timestamp when the message was sent.
 * @since 0.0.5
 * @public
 * @deprecated
 */
exports.dmNotification = function (/**String*/user,/**String*/content,/**Integer*/timestamp) {
  console.log(chalk.yellowBright('>> Bot: You´ve got a DM by ' +  user + " with following content:"));
  console.log(chalk.yellow(content));

  let date = new Date(timestamp);
  let day = this.convertingGetDay(date.getDay());

  // To understand converting timestamps to a normal known date
  // look at this question in StackOverflow -> https://goo.gl/Lb2Nxa
  // MDN Documentation about Date -> https://goo.gl/rT25GW

  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  let seconds = "0" + date.getSeconds();

  console.log(chalk.greenBright('Message sent at ' + day + ", " + date.getMonth() +  "/" + date.getDate() + "/" + date.getFullYear() + ", " + date.getHours() + ':' + minutes.substr(-2) + ":" + seconds.substr(-2) + ' \n'));
};

/**
* Converting the integer from Date.getDay() to a string which contains the day.
*
* @param getDay - Date.getDay integer
* @since 0.0.5
* @private
*/
exports.convertingGetDay = function (getDay) {
  let day;
  switch (getDay){
      case 0:
          day = "Sunday";
          break;
      case 1:
          day = "Monday";
          break;
      case 2:
          day = "Tuesday";
          break;
      case 3:
          day = "Wednesday";
          break;
      case 4:
          day = "Thursday";
          break;
      case 5:
          day = "Friday";
          break;
      case 6:
          day = "Saturday";
          break;
      default:
          day = "A problem occurred when trying to convert the Date.getDay() integer to a string \n";
  }
  return day;
};

/**
* Adding data to log.
*
* @param logData - In logData, your giving an object which will be added to the log.
* @since 0.0.6
* @public
*/
exports.addLog = (/**Object*/logData) => {

  fs.readFile("./../log.json", "utf-8" , (err, data) => {

      if (err) { throw err; }
      let log = JSON.parse(data);

      log.push(logData);
      fs.writeFile("./../log.json", JSON.stringify(log, null, 3), (err) => {
          if(err) throw err;
      })
  })
};
