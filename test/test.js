"use strict";
// Run test through "npm run test"

// Require the built in 'assertion' library
const assert = require('assert');

// Require functions
const checkAuth = require("../lib/utils/checkAuth");

// Require arguments
const checkAuthArgs = require("./args/checkAuth");

// // Create a group of tests about Arrays
// describe('Array', function() {
//   // Within our Array group, Create a group of tests for indexOf
//   describe('#indexOf()', function() {
//     // A string explanation of what we're testing
//     it('should return -1 when the value is not present', function(){
//       // Our actual test: -1 should equal indexOf(...)
//       assert.equal(-1, [1,2,3].indexOf(4));
//     });
//   });
// });

// Group CheckAuth
describe('CheckAuth', function() {
  //Create a group of tests for checkAuth
  describe('checkAuth()', function() {
    it('should return true when user is authenticated', function(){
      // actual test: true should equal checkAuth()
      assert.equal(true, checkAuth(checkAuthArgs.req, {}, checkAuthArgs.next));
    });
  });
});