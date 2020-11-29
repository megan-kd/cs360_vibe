var Song = require('../models/song');
var Playlist = require('../models/playlist');

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

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2.mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var message_contents = " ";

exports.store_playlist_get = function(req, res)
{
  var date = new Date;
  var newPlaylist = new Playlist({Songs: res.body.songs, DateCreated: date});

  db.collection('Playlists').insertOne(newPlaylist, function(err, res){
    if (err) throw err;
    //db.close();
  });
}

exports.export_playlist = function(req, res) {
  console.log(req.session.username);
    if (req.session.username){
    var cursor;
    cursor = db.collection("Songs").find({}).sort({Likes: -1}).limit(15);
    cursor.toArray().then((data) => {
      console.log('is right');
      console.log(data);
      res.render('playlist', { title: 'Playlist of the Day', date: date_today, song_list: data, messege: message_contents});
      messege = " ";
    })
    }
    else {
      res.redirect('/login');
    }
}