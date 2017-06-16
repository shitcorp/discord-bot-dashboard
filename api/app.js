const config = require("./../config.json");
const express = require('express');

var exports = module.exports = {};


exports.startApp = function (client) {

    const app = express();

    app.set('view engine', 'ejs');
    app.use('/api', express.static('api'));
    app.use('/lib', express.static('lib'));

    app.get("/", function (req, res) {
        res.render("index", {data: client});
    });

    app.listen(config.LISTENING_PORT);

};