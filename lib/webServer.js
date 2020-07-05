"use strict";

const express = require("express");
const passport = require("passport");
const discordStrategy = require("passport-discord");
const i18n = require("i18n"); // translation module
const path = require('path');

i18n.configure({
    // locales:['en'],
    directory: __dirname + '/locales',
    cookie: 'locale',
    queryParameter: 'lang',
});

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

    // Sets discord login strategy for passport
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

    // Defines static folders
    app.use('/static', express.static(__dirname + '/views/public'))
    app.use('/lib', express.static(__dirname + '/views/public/lib'))

    // Sets the location of views for ejs
    app.set('views', path.join(__dirname, 'views'));

    // Set render engine to ejs
    app.set('view engine', 'ejs');

    // Define middlewares
    app.use(require("helmet")());
    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(i18n.init); // default: using 'accept-language' header to guess language settings
    app.use(require('morgan')("tiny"));


    // Discord oAuth Login
    app.get('/auth/discord/login/', passport.authenticate('discord', { scope: scopes, prompt: prompt }), function(req, res) {});
    app.get('/auth/discord/callback', passport.authenticate('discord', {failureRedirect: '/auth/discord/failure' }), function(req, res) {
        res.redirect('/info') 
    });
    app.get('/auth/discord/failure', (req, res) => {
        res.send("Failed to login to discord");
    });

    // Define router(S)

    // Homepage
    app.get('/', (req, res) => {
        res.sendFile('/dashboard')
    });

    // Visualizes json user info
    app.get('/info', checkAuth, (req, res) => {
        //console.log(req.user)
        res.json(req.user);
    });

    // Login Page
    app.get('/login', (req, res) => {
        if (req.isAuthenticated()){
            res.redirect('/dashboard')
        }else {
            res.render('pages/login')
        }
    });

    // Logout of passport
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');
    });

    app.get('/dashboard', checkAuth, (req, res) => {
        res.render('pages/dashboard');
    });


    // Bind dashboard to config.port
    app.listen(config.port, () => {
        console.log(`The dashbaord is running at: http://localhost:${config.port}`);
    });

    //Unknown route handler
    app.use((req, res, next) => {
        res.render('pages/404')
    });
    //Internal Error handler
    app.use((err, req, res, next) => {
        res.render('pages/500', {err})
    });
}

// Checks if user if logged in
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login')
}