const config = require("./../config.json");
const express = require('express');
const session = require('express-session');
const bot = require("./main");
const fs = require("fs");
const bodyParser = require('body-parser');

const chalk = require('chalk');
const ctx = new chalk.constructor({level: 3});

const app = express();

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
 * @version 0.0.4
 * @public
 */
exports.startApp = function (/**Object*/ client) {


    let maintenanceStatus;

    app.set('view engine', 'ejs');

    app.use('/api', express.static('api', { redirect : false }));
    app.use('/lib', express.static('lib', { redirect : false }));
    app.use('/styles', express.static('src', { redirect : false }));
    app.use('/scripts', express.static('src', { redirect : false }));
    app.use('/src', express.static('src', { redirect : false }));

    app.use(session({secret: 'ssshhhhh'}));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // ---- GET

    app.get("/", function (req, res) {

        // Checking if session variable is set. If, then it will set the status,
        // if undefined it will set an new session variable. You will see this checking method in each get function.

        if(req.session.maintenanceStatus){
            maintenanceStatus = true;
        }else if(req.session.maintenanceStatus === undefined){
            req.session.maintenanceStatus = false;
            maintenanceStatus = false;
        }else{
            maintenanceStatus = false;
        }

        res.render("index", {data: client, maintenanceStatus: maintenanceStatus});
    });

    app.get("/home", function (req, res) {
        if(req.session.maintenanceStatus){
            maintenanceStatus = true;
        }else if(req.session.maintenanceStatus === undefined){
            req.session.maintenanceStatus = false;
            maintenanceStatus = false;
        }else{
            maintenanceStatus = false;
        }
        res.render("index", {data: client, maintenanceStatus: maintenanceStatus});
    });

    app.get("/dashboard", function (req, res) {
        if(req.session.maintenanceStatus){
            maintenanceStatus = true;
        }else if(req.session.maintenanceStatus === undefined){
            req.session.maintenanceStatus = false;
            maintenanceStatus = false;
        }else{
            maintenanceStatus = false;
        }
        res.render("index", {data: client, maintenanceStatus: maintenanceStatus});
    });

    app.get("/messages", function (req, res) {
        if(req.session.maintenanceStatus){
            maintenanceStatus = true;
        }else if(req.session.maintenanceStatus === undefined){
            req.session.maintenanceStatus = false;
            maintenanceStatus = false;
        }else{
            maintenanceStatus = false;
        }
        res.render("messages", {data: client, maintenanceStatus: maintenanceStatus});
    });

    app.get("/outputClient", function (req, res) {
        console.log(bot.sendClientObject());

        if(req.session.maintenanceStatus){
            maintenanceStatus = true;
        }else if(req.session.maintenanceStatus === undefined){
            req.session.maintenanceStatus = false;
            maintenanceStatus = false;
        }else{
            maintenanceStatus = false;
        }
        res.redirect("/dashboard");
    });

    app.get("/outputGuilds", function (req, res) {
        console.log(bot.sendGuildsObject());

        if(req.session.maintenanceStatus){
            maintenanceStatus = true;
        }else if(req.session.maintenanceStatus === undefined){
            req.session.maintenanceStatus = false;
            maintenanceStatus = false;
        }else{
            maintenanceStatus = false;
        }
        res.redirect("/dashboard");
    });

    app.get("/botStatus", function (req, res) {
        if(req.session.maintenanceStatus){
            maintenanceStatus = true;
        }else if(req.session.maintenanceStatus === undefined){
            req.session.maintenanceStatus = false;
            maintenanceStatus = false;
        }else{
            maintenanceStatus = false;
        }
        res.render("botStatus", {data: client, maintenanceStatus: maintenanceStatus});
    });

    app.get("/status", function (req, res) {
        if(req.session.maintenanceStatus){
            maintenanceStatus = true;
        }else if(req.session.maintenanceStatus === undefined){
            req.session.maintenanceStatus = false;
            maintenanceStatus = false;
        }else{
            maintenanceStatus = false;
        }
        res.render("botStatusPage", {data: client, maintenanceStatus: maintenanceStatus});
    });

    app.get("/activateMaintenance", function (req, res) {
        bot.maintenance(true);
        // Set the session variable to the maintenance status. (here for example to true)
        req.session.maintenanceStatus = true;
        maintenanceStatus = true;

        res.redirect("/dashboard");
    });

    app.get("/deactivateMaintenance", function (req, res) {
        bot.maintenance(false);

        req.session.maintenanceStatus = false;
        maintenanceStatus = false;

        res.redirect("/dashboard");
    });

    /* This GET route is for development usage only.
     * With this route, you can test new functions for your fork
     * when you want to make a pull request and want to check if this function you´ve made works.
     */
    app.get("/testingNewFunction", function (req, res) {

        // Here you´re writing the new function or calling a new function.
        bot.sendInvitesOfServers();

        res.redirect("/");
        console.log("\n>> Redirecting to /");
    });

    // ---- POST

    app.post("/change-game-status" ,function (req, res) {

        // For writing it into the config file.
        config.bot_game = req.body.gameStatus;

        // Using the exports function from the required "./main" module to set the game
        bot.setGameStatus(req.body.gameStatus);

        // TODO: Updating the config.json with the new bot_game value to get the new game value when restarting the bot.

        res.redirect("/");
        console.log("\n>> Redirecting to /");
    });

    app.post("/change-status", function (req,res) {

        bot.setBotStatus(req.body.status);

        res.redirect("/");
        console.log("\n>> Redirecting to /");
    });

    app.post("/send-serveradmin-dm-message", function (req,res) {

        bot.sendAdminMessage(req.body.message);

        res.redirect("/messages");
        console.log("\n>> Redirecting to /messages");
    });



    // ---- 404 Page
    app.use(function (req, res, next) {
        res.status(404).render("404");
    });

    // You may not heard about the package 'chalk'..
    // It is a package for coloring console output. Colors in outputs are important to give a output more attention when its needed.

    // You can look inside the repository of chalk to understand how it works and how to use it.
    // Repository: https://goo.gl/qfQ4Pv

    app.listen(config.LISTENING_PORT, function () {
        console.log(chalk.cyanBright('>> Dashboard is online and running on port ' + config.LISTENING_PORT + '!\n'));
    });

};