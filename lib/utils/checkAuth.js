"use strict";

module.exports = (req, res, next) => {
    // Checks if user if logged in
    
    // If logged in, allow user to continue
    if (req.isAuthenticated()) return next();

    // If not, send to login page
    res.redirect('/login');
    return false;
}