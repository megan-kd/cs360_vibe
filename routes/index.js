//**********************************************************************
// File:				index.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			urls from the home page url to forward any requests to 
//              the correct controller functions
//**********************************************************************

var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');
var song_controller = require('../controllers/songController');

/* GET home page. */
router.get('/', song_controller.song_list);

router.get('/updateAccount', function (req, res, next){
  if (req.session.username){
   
    res.render('updateAccount');
  }
  else {
    res.redirect('/login');
  }
});

router.post('/updateAccount', user_controller.user_update_account_post);
router.get('/updateAccount/deleteAccount', function(req, res){
  if (req.session.username){
    user_controller.user_delete_from_get(req, res);
  }
  else {
    res.redirect('/login');
  }
});

router.post('/incrementLike', song_controller.song_change_likes);

module.exports = router;
