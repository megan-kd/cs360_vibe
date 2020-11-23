var Song = require('../models/song');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2.mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


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