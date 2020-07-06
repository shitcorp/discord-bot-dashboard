"use strict";

const verify = require("./utils/verify");

module.exports = async (config) => {
    await verify(config)

    require("./webServer")({
        port: config.port || process.env.PORT,
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL || `http://localhost:${config.port}/auth/discord/callback`,
        requestLogger: config.requestLogger || true,
        sessionSecret: config.sessionSecret || "keyboard cat"
    });
}