//**********************************************************************
// File:				resetPassword.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			urls from /resetPassword to forward any requests to 
//              the correct controller for reset password functionality
//         
//**********************************************************************
var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

//login page route
router.get('/', function (req, res) {
  res.render('resetPassword');
});

// POST request for creating a new user account
router.post('/', user_controller.user_reset_password_post);

module.exports = router;