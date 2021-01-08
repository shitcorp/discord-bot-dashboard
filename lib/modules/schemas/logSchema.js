const mongoose = require("mongoose");

/**
 * Declare the Schema of the Mongo model
 */
var logSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    logs: {
        type: Array,
        required: false,
        default: "",
    },
});

/**
 * Export the model
 */
module.exports = mongoose.model("dashLogger", logSchema);
