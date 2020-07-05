"use strict";
require("dotenv").config();

const Dashboard = require("./index");

Dashboard({
    port: 5000,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    //callbackURL: process.env.callbackURL
});