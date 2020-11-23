var Song = require('../models/song');
var Playlist = require('../models/playlist');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2.mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

exports.store_playlist_get = function(req, res)
{
  var date = new Date;
  var newPlaylist = new Playlist({Songs: res.body.songs, DateCreated: date});

  db.collection('Playlists').insertOne(newPlaylist, function(err, res){
    if (err) throw err;
    db.close();
  });
}