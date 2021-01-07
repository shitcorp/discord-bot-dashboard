/***
 * @fileOverview The back-end module which is running express.js
 */
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const DiscordStrategy = require("passport-discord.js").Strategy;
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const io = require("socket.io")(server);
const bodyParser = require("body-parser");

/**
 * Util modules
 */
const chalk = require("chalk");
const log = console.log;

/**
 * Init app
 * @param {Discord.js Client} client
 * @param {Dashboard Config} config
 */

module.exports.run = (client, config) => {
    /**
     * App setup
     */

    /**
     * App view
     */
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "../src/views"));
    /**
     * Asset directories
     */
    app.use("/static", express.static(path.join(__dirname, "../src/dist")));
    app.use("/static", express.static(path.join(__dirname, "../src/plugins")));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(
        session({
            secret: config.sessionSecret,
            resave: true,
            saveUninitialized: true,
            cookie: {
                secure: false,
            },
        })
    );

    /**
     * Passport login strategy
     */
    passport.use(
        new DiscordStrategy(
            {
                clientID: client.user.id,
                clientSecret: config.clientSecret,
                callbackURL: config.redirectURI,
                scope: ["identify"],
            },
            function (accessToken, refreshToken, profile, done) {
                /**
                 * Handle Database Query Addition Here.
                 */
                return done(null, profile);
            }
        )
    );

    passport.serializeUser(function (u, d) {
        d(null, u);
    });
    passport.deserializeUser(function (u, d) {
        d(null, u);
    });

    function accountImage(user) {
        return `<img src="${
            "https://cdn.discordapp.com/avatars/" +
            user.id +
            "/" +
            user.avatar +
            ".png"
        }" class="img-circle elevation-2" alt="User Image"></img>`;
    }

    /**
     * Routing
     */

    /**
     * Index page
     */
    app.get("/", (req, res) => {
        if (!req.session.user) {
            res.redirect("/auth/discord");
        } else {
            res.render("index", {
                page: "dashboard",
                bot: client,
                userInfo: req.session.user,
                image: accountImage(req.session.user),
            });
        }
    });
    app.get("/log", (req, res) => {
        if (!req.session.user) {
            res.redirect("/auth/discord");
        } else {
            res.render("log", {
                page: "log",
                bot: client,
                userInfo: req.session.user,
                image: accountImage(req.session.user),
            });
        }
    });
    app.get("/actions", (req, res) => {
        if (!req.session.user) {
            res.redirect("/auth/discord");
        } else {
            res.render("actions", {
                page: "actions",
                guildID: null,
                otherBody: null,
                alert: null,
                bot: client,
                userInfo: req.session.user,
                image: accountImage(req.session.user),
            });
        }
    });
    app.post("/actions", (req, res) => {
        if (!req.session.user) {
            res.redirect("/auth/discord");
        } else {
            let alert;
            console.log(req.body);
            if (
                req.body.sendChannelMessage &&
                req.body.sendChannelGuild &&
                req.body.sendChannelChannel
            ) {
                if (req.body.sendChannelMessage.length > 1) {
                    const guild = client.guilds.cache.get(
                        req.body.sendChannelGuild
                    );
                    const channel = guild.channels.cache.get(
                        req.body.sendChannelChannel
                    );
                    try {
                        channel.send(req.body.sendChannelMessage);
                        alert = "worked";
                    } catch {
                        alert = "wrong";
                    }
                }
            }
            res.render("actions", {
                page: "actions",
                guildID: req.body.sendChannelGuild,
                otherBody: req.body,
                alert: alert,
                bot: client,
                userInfo: req.session.user,
                image: accountImage(req.session.user),
            });
        }
    });

    /**
     * Authorizing pages
     */
    app.get("/auth/discord", passport.authenticate("discord.js"));
    /**
     * Callback for the Discord login
     */
    app.get(
        "/auth/discord/callback",
        passport.authenticate("discord.js", {
            failureRedirect: "/auth/discord/error",
        }),
        function (req, res) {
            /**
             * Accessing the user object easier
             */
            req.session.user = req.session.passport.user;
            /**
             * Successful authentication, redirect home.
             */
            res.redirect("/");
        }
    );

    /**
     * 404 Error handler
     */
    app.use(function (req, res, next) {
        if (!req.session.user) {
            res.redirect("/auth/discord");
        } else {
            res.status(404).render("404", {
                page: "404",
                bot: client,
                userInfo: req.session.user,
                image: accountImage(req.session.user),
            });
        }
    });
    /**
     * 500 Error handler
     */
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).render("500", {
            page: "500",
            bot: client,
            userInfo: req.session.user,
            image: accountImage(req.session.user),
        });
    });

    io.on("connection", (socket) => {
        log(chalk.yellow("Socket") + " >> A user has connected");
    });

    /**
     * Listener
     */
    server.listen(config.port, () => {
        log(
            "INFO >> " +
                chalk.green("Dashboard is running on port " + config.port)
        );
    });
};
module.exports.event = (event, amount) => {
    io.emit(event, {
        amount,
    });
};
