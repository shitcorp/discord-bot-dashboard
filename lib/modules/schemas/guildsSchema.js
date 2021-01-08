const mongoose = require("mongoose");

/**
 * Declare the Schema of the Mongo model
 */
var guildSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    iconURL: {
        type: String,
        required: true,
    },
    memberCount: {
        type: String,
        required: true,
    },
    joinedTimeStamp: {
        type: String,
        required: true,
    },
    removedTimeStamp: {
        type: String,
        required: false,
    },
});

/**
 * Export the model
 */
module.exports = mongoose.model("dashGuild", guildSchema);
