/**
 * @fileOverview The back-end module which is running express.js
 * @module server
 */

const express = require('express');
const session = require('express-session');
const passport = require("passport");
const chalk = require('chalk');
// const helmet = require('helmet'); //Http security headers
// const csrf = require('csurf'); //Blocks Cross-Site Request Forgeries
// const bodyParser = require('body-parser');

const app = express();

// const redisClient = require('redis').createClient();
// const limiter = require('express-limiter')(app, redisClient);
const DiscordStrategy = require("passport-discord.js").Strategy;
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const log = console.log;
const scopes = ["identify"];

// use xhr request to push data to the server

/*
limiter({
  // path: '/api/action',
  // method: 'get',
  lookup: ['connection.remoteAddress'],
  // 150 requests per hour
  total: 150,
  expire: 1000 * 60 * 60
});*/

/**
 * The function used to run the dashboard
 * @param {Object} client Disocrd.js Client object.
 * @param {Object} config Config object
 */
module.exports.run = (client, config) => {

  // const cookieSecure = config.ssl ? true : false;
  if (config.ssl) {
    app.set("trust proxy", config.reverseProxyIp);
  }

  // App view
  app.set('view engine', 'ejs');
  app.set('views', './src/views');

  // Asset directories
  app.use('/static', express.static('./src/dist'));
  app.use('/static', express.static('./src/plugins'));

  app.use(require('body-parser').urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
  // app.use(bodyParser.json()); // parse application/json
  app.use(require('cookie-parser')());
  // /*
  app.use(session({  
    secret: process.env.SESSION_SECRET,
    key: 'sessonID', 
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      //domain: 'example.com',
      // path: '/Discord-Bot-Dashboard',
      // Cookie will expire in 3 hours from when it's generated 
      expires: new Date( Date.now() + 180 * 60 * 1000 ) // + 180 min * 60 = seconds * 1000 for milliseconds
    }
  }));
  // */
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(require('csurf')({ cookie: true }));
  app.use(require('helmet')());

  // for passport-discord, not passport-discord.js Moving to passport-discord at some point
  // passport login strategy
  // passport.use(new DiscordStrategy({ clientID: client.user.id, clientSecret: config.clientSecret, callbackURL: config.redirectURI, scope: scopes }, (accessToken, refreshToken, profile, done) => {
  //   process.nextTick(function(){
  //     return done(null, profile);
  //   });
  // })
  // );

  // passport login strategy
  passport.use(new DiscordStrategy({
    clientID: client.user.id,
    clientSecret: config.clientSecret,
    callbackURL: config.redirectURI,
    scope: ["identify"]
  },
    function (accessToken, refreshToken, profile, done) {
      //Handle Database Query Addition Here.
      //console.log(profile);
      return done(null, profile);
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // (only-read) Basic information about the bot
  const botInfo = {
    username: client.user.username,
    status: client.user.presence.status,
    users: client.users.size,
    guilds: client.guilds.size
  };

  function accountImage(user) {
    return `<img src="${"https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png"}" class="img-circle elevation-2" alt="User Image"></img>`
  }

  /*
  * Routing
  */
  // Index page
  app.get('/', (req, res) => {
    // if (!req.user) {
    if (!req.session.user) {
      res.redirect('/auth/discord');
    } else {
      res.render('index', { page: "dashboard", botInfo: botInfo, userInfo: req.user, image: accountImage(req.session.user), csrfToken: req.csrfToken() });
      //res.send(`Hello ${req.session.user.username}`);
    }
  });
  app.get('/log', (req, res) => {
    // if (!req.user) {
      if (!req.session.user) {
      res.redirect('/auth/discord');
    } else {
      res.render('log', { page: "log", botInfo: botInfo, userInfo: req.user, image: accountImage(req.session.user) });
    }
  });

  // Authorizing pages
  app.get("/auth/discord", passport.authenticate("discord.js")); //passport.authenticate("discord", { scope: scopes }));
  // Callback for the Discord login
  app.get("/auth/discord/callback", passport.authenticate("discord.js", { failureRedirect: "/auth/discord/error" }), /*assport.authenticate("discord", { failureRedirect: "/auth/discord/error" }),*/ (req, res) => {
    // Accessing the user object easier
    req.session.user = req.session.passport.user;
    // Successful authentication, redirect home.
    res.redirect("/");
    // res.redirect('/info');
  });

  // app.get('/info', checkAuth, function (req, res) {
  //   //console.log(req.user)
  //   res.json(req.user);
  // });

  // 404 Error handler
  /*app.use((req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/discord');
    } else {
      return res.status(404).render('404', {page: "404", botInfo: botInfo, userInfo: req.session.user, image: accountImage(req.session.user)});
    }
  });
  // 500 Error handler
  /*app.use((err, req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/discord');
    } else {
      console.error(err.stack);
      return res.status(500).render('500', {page: "500", botInfo: botInfo, image: accountImage(req.session.user)});
    }
  });*/

  io.on('connection', (socket) => {
    //log(chalk.yellow('Socket') + ' >> A user has connected');
  });

  // Listener
  server.listen(config.port, () => {
    log('INFO >> ' + chalk.green(`Dashboard is running on http://localhost:${config.port}/`));
  });
  /*app.listen(config.port, () => {
    log('INFO >> ' + chalk.green('Dashboard is running on port ' + config.port));
  });*/
}

// function checkAuth(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.send('not logged in :(');
// }

/**
 * @param {String} event The socket.io event
 * @param {Number} amount The "amout" passed. ie number of guilds
 */
module.exports.event = (event, amount) => {
  io.emit(event, {
    amount: amount
  });
}