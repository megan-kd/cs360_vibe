//**********************************************************************
// File:				login.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			urls from /login to forward any requests to 
//              the correct controller for login functionality
//         
//**********************************************************************

var express = require('express');
var router = express.Router();
var login_controller = require("../controllers/loginController");

//login page route, get request
router.get('/', function (req, res) {
   req.session.destroy(function(err){
     console.log(err);
   });
   res.render('login');
  
});

// login page route, post request
router.post('/', login_controller.login_authenticate_post);

module.exports = router;