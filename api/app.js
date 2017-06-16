const config = require("./../config.json");
const express = require('express');

const app = express();

var exports = module.exports = {};


exports.startApp = function (client) {


    app.set('view engine', 'ejs');
    app.use('/api', express.static('api'));
    app.use('/lib', express.static('lib'));
    app.use('/styles', express.static('src'));
    app.use('/scripts', express.static('src'));

    app.get("/", function (req, res) {
        res.render("index", {data: client});
    });

    app.use(function (req, res, next) {
        res.status(404).render("404");
    });


    app.listen(config.LISTENING_PORT);

};