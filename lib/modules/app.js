"use strict";

/***
 * @fileOverview The back-end module which is running express.js
 */
const express = require("express");
const passport = require("passport");
const discordStrategy = require("passport-discord");
const i18n = require("i18n"); // translation module
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const guildSchema = require("./schemas/guildsSchema");
const logSchema = require("./schemas/logSchema");
i18n.configure({
    // locales:['en'],
    directory: path.join(__dirname, "../locales"),
    cookie: 'locale',
    queryParameter: 'lang',
});
const chalk = require("chalk");
const logger = require("./logger");
const log = console.log;
const prompt = 'consent';
const scopes = ['identify'];

/**
 * Init app
 * @param {Discord.js Client} client
 * @param {Dashboard Config} config
 */

module.exports.run = (client, config) => {
    logger(client, io)
    mongoose.Promise = global.Promise;
    mongoose.connect(
        config.mongodbURI,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        },
        (err) => {
            if (!err) {
                log("INFO >> " + chalk.green("MongoDB Connection Succeeded."));
            } else {
                log("INFO >> " + chalk.red("Error in DB connection: " + err));
            }
        }
    );

    /**
     * App view
     */
    /**
     * Defines static folders
     */
    app.use("/static", express.static(path.join(__dirname, "../src/dist")));
    app.use("/static", express.static(path.join(__dirname, "../src/plugins")));

    /**
     * Sets the location of views for ejs
     */
    app.set("views", path.join(__dirname, "../src/views"));

    /**
     * Set render engine to ejs
     */
    app.set("view engine", "ejs");

    /**
     * Define middlewares
     */
    app.use(require('express-session')({ secret: config.sessionSecret, resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(i18n.init); // default: using 'accept-language' header to guess language settings
    app.use(require('morgan')("tiny"));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    /**
     * Passport serialization stuff
     */
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    /**
     * Passport login strategy
     */
    passport.use(new discordStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.redirectURI,
        scope: scopes,
        prompt: prompt
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
    
    /**
     * Authorizing pages
     */
    app.get('/auth/discord', passport.authenticate('discord', { scope: scopes, prompt: prompt }));
    /**
     * Callback for the Discord login
     */
    app.get("/auth/discord/callback", passport.authenticate("discord", {failureRedirect: "/auth/discord/error" }), function (req, res) {
            /**
             * Accessing the user object easier
             */
            req.session.user = req.session.passport.user;
            /**
             * Successful authentication, redirect home.
             */
            res.redirect("/");
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
    app.get("/log", async (req, res) => {
        if (!req.session.user) {
            res.redirect("/auth/discord");
        } else {
            const logs = await logSchema.findById({
                _id: client.user.id
            })
            res.render("log", {
                page: "log",
                bot: client,
                logs,
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
    app.post("/actions", async (req, res) => {
        if (!req.session.user) {
            res.redirect("/auth/discord");
        } else {
            /**
             * Send Message
             */
            let alert;
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
                    } catch (err) {
                        console.log(err);
                        alert = "wrong";
                    }
                }
            }

            /**
             * Bot Status
             */
            if (req.body.botStatus) {
                await client.user.setStatus(`${req.body.botStatus}`);
            }
            if (req.body.botActivityText && req.body.botActivityType) {
                if (req.body.botActivityURL) {
                    try {
                        await client.user.setActivity(
                            `${req.body.botActivityText}`,
                            {
                                type: `${req.body.botActivityType}`,
                                url: `${req.body.botActivityURL}`,
                            }
                        );
                        alert = "worked";
                    } catch (err) {
                        console.log(err);
                        alert = "wrong";
                    }
                } else {
                    try {
                        await client.user.setActivity(
                            `${req.body.botActivityText}`,
                            {
                                type: `${req.body.botActivityType}`,
                            }
                        );
                        alert = "worked";
                    } catch (err) {
                        console.log(err);
                        alert = "wrong";
                    }
                }
            } else {
                alert = "wrong";
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
     * Guilds Page
     */
    app.get("/guilds", async (req, res) => {
        if (!req.session.user) {
            res.redirect("/auth/discord");
        } else {
            let jsonArray = [];
            await guildSchema.find().then((guild) => {
                guild.forEach((guild_2) => {
                    jsonArray.push(guild_2);
                });
            });
            if (jsonArray.length < client.guilds.cache.size) {
                jsonArray = [];
                await client.guilds.cache.forEach(async (g) => {
                    let clientMember = await g.members.fetch(client.user.id);
                    const gInDb = await guildSchema.findById({
                        _id: g.id,
                    });
                    if (!gInDb) {
                        await new guildSchema({
                            _id: g.id,
                            name: g.name,
                            memberCount: g.memberCount,
                            iconURL: g.iconURL() ? g.iconURL({dynamic: true, size: 2048, format: "png" }) : client.user.displayAvatarURL({dynamic:true,format:'png',size:2048}),
                            joinedTimeStamp: clientMember.joinedTimestamp,
                            removedTimeStamp: "",
                        }).save();
                    }
                });
                await guildSchema.find().then((guild) => {
                    guild.forEach((guild_2) => {
                        jsonArray.push(guild_2);
                    });
                });
            }
            res.render("guilds", {
                page: "guilds",
                jsonArray,
                bot: client,
                userInfo: req.session.user,
                image: accountImage(req.session.user),
            });
        }
    });

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
