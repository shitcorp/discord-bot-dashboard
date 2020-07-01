"use strict";

const { verifyError } = require("./utils");

module.exports = (config) => {
    verify(config);

    require("./webServer")({
        port: config.port || process.env.PORT,
    });
}

function verify (config) {
    //Check config type
    if (typeof config !== "object") throw new Error("The config must be an object");

    //Check typeof items
    if (config.port && typeof config.port !== "number") verifyError("port", "number");
}