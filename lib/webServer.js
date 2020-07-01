"use strict";

const express = require("express");

module.exports = (config) => {
    const app = express();

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(config.port, () => {
        console.log(`The dashbaord is running at: http://localhost:${config.port}`);
    });
}