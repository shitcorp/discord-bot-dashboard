"use strict";

const express = require("express");
const passport = require("passport");
const discordStrategy = require("passport-discord");

const scopes = ['identify'];
const prompt = 'consent';

module.exports = (config) => {
    const app = express();

    // Passport serialization stuff
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new discordStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: scopes,
        prompt: prompt
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));

    // Define middlewares
    app.use(require("helmet")());
    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(require('morgan')("tiny"));


    // Discord oAuth Login
    app.get('/auth/discord/login/', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function(req, res) {});
    app.get('/auth/discord/callback', passport.authenticate('discord', {failureRedirect: '/auth/discord/failure' }), function(req, res) {
        res.redirect('/info') 
    });
    app.get('/auth/discord/failure', (req, res) => {
        res.send("Failed to login to discord");
    });

    // Define routes

    // Homepage
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    // Visualizes json user info
    app.get('/info', checkAuth, function(req, res) {
        //console.log(req.user)
        res.json(req.user);
    });

    // Logout of passport
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // Bind dashboard to config.port
    app.listen(config.port, () => {
        console.log(`The dashbaord is running at: http://localhost:${config.port}`);
    });
}

// Checks if user if logged in
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}