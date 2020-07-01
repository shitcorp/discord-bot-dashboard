"use strict";

const { verifyError, verifyTypeError } = require("./utils");

module.exports = (config) => {
    verify(config);

    require("./webServer")({
        port: config.port || process.env.PORT,
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL || `http://localhost:${config.port}/auth/discord/callback`
    });
}

function verify (config) {
    //Check config type
    if (typeof config !== "object") throw new Error("The config must be an object");

    // Check if require items exist
    if (!config.clientID) verifyError("clientID");
    if (!config.clientSecret) verifyError("clientSecret");

    //Check typeof items
    if (config.port && typeof config.port !== "number") verifyTypeError("port", "number");
    if (config.callbackURL && typeof config.callbackURL !== "string") verifyTypeError("callbackURL", "string");
}