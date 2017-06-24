const configFileName = "./../config.json";
const config = require(configFileName);
const express = require('express');
const bot = require("./main");
const fs = require("fs");
const bodyParser = require('body-parser');

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
 * @version 0.0.2-beta
 * @public
 */
exports.startApp = function (/**Object*/ client) {

    // console.log(client)

    app.set('view engine', 'ejs');

    app.use('/api', express.static('api'));
    app.use('/lib', express.static('lib'));
    app.use('/styles', express.static('src'));
    app.use('/scripts', express.static('src'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // ---- GET

    app.get("/", function (req, res) {
        res.render("index", {data: client});
    });

    app.get("/home", function (req, res) {
        res.render("index", {data: client});
    });

    app.get("/dashboard", function (req, res) {
        res.render("index", {data: client});
    });

    app.get("/outputClient", function (req, res) {
        res.render("index", {data: client});
        console.log(bot.sendClientObject());
    });

    /* This GET route is for development usage only.
     * With this route, you can test new functions for your fork
     * when you want to make a pull request and want to check if this function you´ve made works.
     */
    app.get("/testingNewFunction", function (req, res) {
        res.render("index", {data: client});

        // Here you´re writing the new function or calling a new function.
        bot.sendAdminMessage("This is a test message by " + client.user.username + ". " +
            "You get the message because we´re currently testing an new feature for sending messages to server administrators and you are one. Believe me.")
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



    // ---- 404 Page
    app.use(function (req, res, next) {
        res.status(404).render("404");
    });


    app.listen(config.LISTENING_PORT);

};