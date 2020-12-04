//**********************************************************************
// File:				playlistController.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			functions to access the playlist model when requested,
//              return an HTML page for the user to view in the 
//              browser
//**********************************************************************
var Song = require('../models/song');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2." +
 "mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true,
   useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*************************************************************************
Function:    export_playlist

Description: exports the top 15 songs to the playlist page to be displayed

Parameters:  req - request to server
             res - response to requester in form of web page or message

Returned:    None
*************************************************************************/

exports.export_playlist = function(req, res) {
    if (req.session.username){
    var cursor;
    cursor = db.collection("Songs").find({}).sort({Likes: -1}).limit(15);
    cursor.toArray().then((data) => {
      res.render('playlist', { title: 'Playlist of the Day', 
                song_list: data});
    })
    }
    else {
      res.redirect('/login');
    }
}