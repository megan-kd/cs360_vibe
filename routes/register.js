//**********************************************************************
// File:				register.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			urls from /addSong to forward any requests to 
//              the correct controller for addSong functionality
//         
//**********************************************************************

var express = require('express');
var router = express.Router();

//require controller modules
var user_controller = require('../controllers/userController');

//login page route
router.get('/', function (req, res) {
  res.render('register');
});

// POST request for creating a new user account
router.post('/createAccount', user_controller.user_create_post);

//spotify redirect potentially
module.exports = router;