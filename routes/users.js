const express = require('express');
const router = express.Router(); // Create a new router
const catchAsync = require('../utils/catchAsync'); // catchAsync module
const users = require('../controllers/users'); // user module
const passport = require('passport'); // passport module
const { storeReturnTo } = require('../middleware'); // middleware module


router.route('/register')
    .get(users.renderRegister) // Register page
    .post(catchAsync(users.register)) // Register new user

router.route('/login')
    .get(users.renderLogin) // Login page
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login); // Login user

// Logout user
router.get('/logout', users.logout); 

module.exports = router; // Export the router
