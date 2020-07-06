"use strict";

module.exports = async (config) => {
    //Check config type
    if (typeof config !== "object") throw new Error("The config must be an object");

    // Check if require items exist
    checkRequired(config.clientID, "clientID");
    checkRequired(config.clientSecret, "clientSecret")

    //Check typeof items
    checkType(config.port, "port", "number");
    checkType(config.callbackURL, "callbackURL", "string")
    checkType(config.requestLogger, "requestLogger", "boolean")
    checkType(config.sessionSecret, "sessionSecret", "string")

    return;
}

function checkType (item, name, type) {
    if (item && typeof item !== type) verifyTypeError(name, type);
}

function checkRequired (item, name) {
    if (item == undefined) verifyError(name);
}

function verifyTypeError (item, itemType) {
    throw new TypeError(`The dashbaord config item '${item}' must be a ${itemType}`);

}

function verifyError (item) {
    throw new Error(`The dashbaord config item '${item}' is required for proper operation`);
}