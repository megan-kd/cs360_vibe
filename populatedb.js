#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var bcrypt = require("bcrypt");
var Song = require('./models/song')
var User = require('./models/user')


var mongoose = require('mongoose');
const song = require('./models/song');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var songs = [];
var users = [];

function songCreate (title, artist, album, likes, whenUploaded, cb)
{
  songdetail = {
    Title : title, 
    Atrist : artist,
    Album : album,
    Likes : likes,
    WhenUploaded : whenUploaded
  }

  var newSong = new Song(songdetail);

  newSong.save(function(err){
    if (err) {
      cb(err, null)
      return
    }
    console.log("New Song: " + newSong);
    songs.push(newSong)
    cb(null, newSong);
  });
}

function userCreate(firstname, lastName, Username, Password, cb){
  
  bcrypt.hash(Password, 10, function(err, encrypted){
    if (err){
      console.log(err);
    }
    else {
      userdetail = {
      firstName : firstname,
      lastname : lastName,
      username : Username,
      password : encrypted
      }
    }
  });
  var newUser = new User(userdetail);

  newUser.save(function(err)
  {
    if (err) {
      cb(err, null)
      return
    }
    console.log("New User: " + newUser);
    users.push(newUser)
    cb(null, newUser);
  });

}


function createSongs(cb) {
  var date = new Date;
  async.parallel([
    function(callback) {
      songCreate(
        'Yell Fire!', 'Michael Franti & Spearhead', 'Yell Fire', 1, date, callback
      );
      songCreate(
        'In The Air Tonight', 'Phil Collins', 'Face Value', 2, date, callback
      );
      songCreate(
        "Don't Bring Me Down", 'Electric Light Orchestra', 'Discovery', 3, date, callback
      );
      songCreate(
        'The Boxer', 'Simon & Garfunkel', 'A New Music City', 4, date, callback
      );
      songCreate(
        'Sweet Dreams (Are Made of This)', 'Eurythimcs, Annie Lennox & Dave Stewart', 'RCA', 5, date, callback
      );
      songCreate(
        'Spirit in The Sky', 'Norman Greenbaum', 'Spirit in The Sky', 6, date, callback
      );
      songCreate(
        'Free Bird', 'Lynyrd Skynyrd', 'Pronounced Leh-Nerd Skin-Nerd', 7, date, callback
      );
      songCreate(
        "Walkin' On The Sun", "Smash Mouth", 'Fush Yu Mang', 8, date, callback
      );
      songCreate(
        "S.O.B", "Nathaniel Rateliff & The Night Sweats", "Nathaniel Rateliff & The Night Sweats", 9, date, callback
      );
      songCreate(
        "Cat's In The Cradle", "Harry Chapin", "Varities & Balderdash", 10, date, callback
      );
    },
  ],
  cb);
}

function createUsers(cb) {
  async.parallel([
    function(callback) {
      userCreate('Ethan', 'Hunter', 'EHunter', 'pword1');
      userCreate('Megan', 'Deyoung', 'MDeyoung', 'pword2');
      userCreate('Logan', 'Jepson', 'LJepson', 'pword3');
      userCreate('Garret', 'Katayama', 'GKatayama', 'pword4');
      userCreate('Chadd', 'Williams', 'CWilliams', 'pword5');
      userCreate('Shereen', 'Khoja', 'SKhoja', 'pword6');
      userCreate('Doug', 'Ryan', 'TheCoolestTeacher', 'dougiscool');
    }
  ],
  cb)
}


async.series([
  createSongs,
  createUsers
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Songs: '+songs);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



