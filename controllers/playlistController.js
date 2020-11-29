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
var Playlist = require('../models/playlist');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2." +
 "mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true,
   useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*************************************************************************
Function:    store_playlist_get

Description: add all the songs in the export song body to a playlist

Parameters:  req - request to server
             res - response to requester in form of web page or message

Returned:    None
*************************************************************************/
exports.store_playlist_get = function(req, res)
{
  var date = new Date;
  var newPlaylist = new Playlist({Songs: res.body.songs, DateCreated: date});

  db.collection('Playlists').insertOne(newPlaylist, function(err, res){
    if (err) throw err;
    db.close();
  });
}