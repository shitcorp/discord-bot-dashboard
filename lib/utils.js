"use strict";

module.exports.verifyError = (item, itemType) => {
    throw new TypeError(`The dashbaord config item '${item}' must be a ${itemType}`);
}