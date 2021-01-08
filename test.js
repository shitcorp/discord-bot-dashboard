"use strict";

/**
 * This test file is used to test the basic functionality of the dashbaord.
 * It is also here to serve as an example implementation of the module.
 */
require("dotenv").config();
const { Client } = require("discord.js");
const Dashboard = require("./lib/index");

/**
 * Create an instance of a Discord client
 */
const client = new Client();
const dashboard = new Dashboard(client, {
    port: 8080,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    redirectURI: `http://localhost:8080/auth/discord/callback`,
    websiteDomain: "http://localhost:8080",
    mongodbURI: process.env.mongoDBURL,
});

client.on("ready", () => {
    dashboard.run();
});

client.login(process.env.TOKEN);
