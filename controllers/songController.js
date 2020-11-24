var Song = require('../models/song');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2.mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


exports.store_song_get = function (req, res)
{
  var message = '';
  var date = new Date;
  console.log('song request recieved');
  db.collection("Songs").findOne({Title: req.body.name}, function(err, song){
    if (err) {
      console.log(err);
    }
    else if (song) {
    message = "Song is already on the Playlist";
    console.log('ERROR, song already exists');
    res.render('index', {message:message});
    message = '';
    }
  else {
  db.collection("Songs").findOne({username: req.body.newusername}, function(err, user){
  if (err) {
    console.log(err);
  }
  else if (user) {
  message = "You can only add one song per day";
  console.log('ERROR, one song per day');
  res.render('index', {message:message});
  message = '';
  }
else {
  var newSong = new Song({Title: req.body.name, Artist: req.body.artists[0],
    Album: req.body.album.name, Likes: 0, WhoUploaded: req.body.user,
    WhenUploaded: date});
  db.collection("Songs").insertOne(newSong, function(err, res){
    if (err) throw err;
    db.close();
  });
  message = "Song Added";
  res.render('index', {message:message});
}
});
}
});
}
exports.song_increment_likes = function (req, res)
{
  db.collection("Songs").updateOne({Title: req.body.title, Artist: req.body.artist}, {$inc: {Likes: 1}});
}

exports.song_decrement_likes = function (req, res)
{
  db.collection("Songs").updateOne({Title: req.body.title, Artist: req.body.artist}, {$inc: {Likes: -1}});
}