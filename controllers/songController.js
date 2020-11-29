var Song = require('../models/song');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2.mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let current = new Date();

let month = current.getMonth();
let day = current.getDate();
let year = current.getFullYear();

let date_today = month + "/" + day + "/" + year;
var message_contents = " ";

exports.store_song_get = function (req, res)
{
  var date = new Date;
  console.log('song request recieved');
  db.collection("Songs").findOne({SongID: req.body.id}, function(err, song){
    if (err) {
      console.log(err);
    }
    else if (song) {
    message_contents = "Song is already on the Playlist";
    console.log('ERROR, song already exists');
    //res.send('This song has already been added');
    res.redirect('/');
    }
  else {
  db.collection("Songs").findOne({WhoUploaded: req.session.username}, function(err, user){
  if (err) {
    console.log(err);
  }
  else if (user) {
  message_contents = "You can only add one song per day";
  console.log('ERROR, one song per day');
  res.redirect('/');
  }
else {
  console.log('after this');
  console.log(req.body.artists[0]);
  var newSong = new Song({Title: req.body.name, Artist: req.body.artists[0].name,
    Album: req.body.album.name, Likes: 0, WhoUploaded: req.session.username,
    WhenUploaded: date, SongID: req.body.id});
  db.collection("Songs").insertOne(newSong, function(err, res){
    if (err) throw err;
    //db.close();
  });
  message_contents = "Song Added";
  res.redirect('/');
}
});
}
});
};
exports.song_change_likes = function (req, res)
{
  /*Song.updateOne({Title: req.body.title}).populate('WhoLiked').exec(function(err, list_users) {
    if (err) {return next(err); }
    const found = list_users.WhoLiked.find(function (user) {
      return user.username === req.session.username;
    });
    if (found) {
      list_users.likes -= 1;
      const index = list_users.WhoLiked.findIndex(function (user) {
        return user.username === req.session.username;
      });
      list_users.WhoLiked.splice(index, 1, )
    }
    else {

    }
    console.log(list_users);
  });*/
}

exports.song_decrement_likes = function (req, res)
{
  db.collection("Songs").updateOne({Title: req.body.title, Artist: req.body.artist}, {$inc: {Likes: -1}});
}

exports.song_list = function (req, res, next) {

    console.log(req.session.username);
    if (req.session.username){
    var cursor;
    cursor = db.collection("Songs").find({});
    cursor.toArray().then((data) => {
      res.render('index', { title: 'Playlist of the Day', date: date_today, song_list: data, messege: message_contents});
      messege = " ";
    })
    }
    else {
      res.redirect('/login');
    }
};