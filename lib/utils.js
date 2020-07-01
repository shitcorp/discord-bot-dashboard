"use strict";

module.exports.verifyError = (item) => {
    throw new Error(`The dashbaord config item '${item}' is required for proper operation`);
}

module.exports.verifyTypeError = (item, itemType) => {
    throw new TypeError(`The dashbaord config item '${item}' must be a ${itemType}`);

}