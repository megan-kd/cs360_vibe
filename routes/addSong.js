//**********************************************************************
// File:				addSong.js
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
var song_controller = require('../controllers/songController');

router.post('/', song_controller.store_song_get);

module.exports = router;