"use strict";
// Simulation of next() function in express for checkAuth function

module.exports.req = {
    isAuthenticated: () => {
        return true;
    },
    redirect: () => {
        // So test doesn't error if called
    }
}

module.exports.next = () => {
    return true;
}