<<<<<<< HEAD
//**********************************************************************
// File:				songController.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			functions to access the song model when requested,
//              return an HTML page for the user to view in the 
//              browser
//**********************************************************************
var Song = require('../models/song');
let alert = require('alert');
var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2." +
 "mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true,
   useUnifiedTopology: true});
=======
var Song = require('../models/song');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2.mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
>>>>>>> main
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

<<<<<<< HEAD
/*************************************************************************
Function:    store_song_get

Description: add a song to the database through get request

Parameters:  req - request to server
             res - response to requester in form of web page or message

Returned:    None
*************************************************************************/
exports.store_song_get = function (req, res)
{
  let date = new Date;
  console.log('song request recieved');
  db.collection("Songs").findOne({SongID: req.body.id}, function(err, song){
    if (err) {
      console.log(err);
    }
    else if (song) {
    console.log('ERROR, song already exists');
    res.redirect('/');
    alert("ERROR, song already exists");
    }
  else {
  db.collection("Songs").findOne({WhoUploaded: req.session.username},
 function(err, user){
  if (err) {
    console.log(err);
  }
  else if (user) {
  console.log('ERROR, one song per day');
  res.redirect('/');
  alert("ERROR, one song per day");
  }
else {
  console.log('after this');
  console.log(req.body.artists[0]);
  var newSong = new Song({Title: req.body.name, Artist: req.body.artists[0].name,
    Album: req.body.album.name, Likes: 0, WhoUploaded: req.session.username,
    WhenUploaded: date, SongID: req.body.id});
  db.collection("Songs").insertOne(newSong, function(err, res){
    if (err) throw err;
  });
  res.redirect('/');
  alert("Song Added");
}
});
}
});
};

/*************************************************************************
Function:    song_change_likes

Description: change the number of likes a song has

Parameters:  req - request to server
             res - response to requester in form of web page or message

Returned:    None
*************************************************************************/
exports.song_change_likes = function (req, res)
{
  let date = new Date;

  db.collection("Songs").updateOne({WhoUploaded: req.body.WhoUploaded}, {$inc: {Likes: 1}});
  db.collection("User").updateOne({username: req.session.username}, {$set: {hasVoted: true}});
  db.collection("User").updateOne({username: req.session.username}, {$set: {whenVoted: date}});
  console.log(req.session);
}

/*************************************************************************
Function:    song_list

Description: return the top 15 songs for the daily playlist

Parameters:  req - request to server
             res - response to requester in form of web page or message

Returned:    None
*************************************************************************/
exports.song_list = function (req, res, next) {
  console.log(req.session);
  let hasVotedHolder;
  db.collection("User").findOne({username: req.session.username}).then((user) => {
    hasVotedHolder = user.hasVoted;
  });
  console.log(hasVotedHolder);
  if (req.session.username){
  var cursor;
  cursor = db.collection("Songs").find({});
  cursor.toArray().then((data) => {
    if (hasVotedHolder === true || hasVotedHolder === false) {
    res.render('index', { title: 'Playlist of the Day', 
                          song_list: data, hasVoted: hasVotedHolder.toString()});
    }
    else {
    //this is to fix a weird bug, easiest way to do it
    res.render('index', { title: 'Playlist of the Day', 
                          song_list: data, hasVoted: "true"});
    }
  })
  }
  else {
    res.redirect('/login');
  }
};
=======

exports.store_song_get = function (req, res)
{
  //var message = '';
  var date = new Date;
  var newSong = new Song({Title: req.body.title, Artist: req.body.artist,
    Album: req.body.album, Likes: 0, WhoUploaded: req.body.user,
    WhenUploaded: date});
  db.collection("Songs").insertOne(newSong, function(err, res){
    if (err) throw err;
    db.close();
  });
  res.redirect('/');
}

exports.song_increment_likes = function (req, res)
{
  db.collection("Songs").updateOne({Title: req.body.title, Artist: req.body.artist}, {$inc: {Likes: 1}});
}

exports.song_decrement_likes = function (req, res)
{
  db.collection("Songs").updateOne({Title: req.body.title, Artist: req.body.artist}, {$inc: {Likes: -1}});
}
>>>>>>> main
