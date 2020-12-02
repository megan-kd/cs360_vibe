#! /usr/bin/env node


// Get arguments passed on command line
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var bcrypt = require("bcrypt");
var Song = require('./models/song')
var Usermodel = require('./models/user')


var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2." +
"mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Songs = [];
var User = [];

function songCreate (title, artist, album, likes, whenUploaded, cb)
{
  songdetail = {
    _id: new mongoose.Types.ObjectId(),
    Title : title, 
    Artist : artist,
    Album : album,
    Likes : likes,
    WhenUploaded : whenUploaded
  }

  var newSong = new Song(songdetail);

  newSong.save(function(err){
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Song: " + newSong);
    Songs.push(newSong)
    cb(null, newSong);
  });
  
}

function userCreate(firstname, lastName, Username, Password, cb){
  
  bcrypt.hash(Password, 10, function(err, encrypted){
    if (err){
      console.log(err);
      return;
    }
    else {
      userdetail = {
      _id: new mongoose.Types.ObjectId(),
      firstName : firstname,
      lastname : lastName,
      username : Username,
      password : encrypted
      }
      var newUser = new Usermodel(userdetail);

      newUser.save(function(err)
      {
        if (err) {
          cb(err, null)
          return
        }
        console.log("New User: " + newUser);
        User.push(newUser)
        cb(null, newUser);
      });
    }
  });
 

}


function createSongs(cb) {
  var date = new Date;
  async.series([
    function(callback) {
      songCreate(
        'Yell Fire!', 'Michael Franti & Spearhead', 'Yell Fire', 1, date, callback
      );
    },
    function(callback) {
      songCreate(
        'In The Air Tonight', 'Phil Collins', 'Face Value', 2, date, callback
      );
    },
    function(callback) {
      songCreate(
        "Dont Bring Me Down", 'Electric Light Orchestra', 'Discovery', 3, date, callback
      );
    }, 
    function(callback) {
      songCreate(
        'The Boxer', 'Simon & Garfunkel', 'A New Music City', 4, date, callback
      );
    }, 
    function(callback) {
      songCreate(
        'Sweet Dreams (Are Made of This)', 'Eurythimcs, Annie Lennox & Dave Stewart', 'RCA', 5, date, callback
      );
    },
    function(callback) {
      songCreate(
        'Spirit in The Sky', 'Norman Greenbaum', 'Spirit in The Sky', 6, date, callback
      );
    },
    function(callback) {
      songCreate(
        'Free Bird', 'Lynyrd Skynyrd', 'Pronounced Leh-Nerd Skin-Nerd', 7, date, callback
      );
    },
    function(callback) {
      songCreate(
        "Walkin On The Sun", "Smash Mouth", 'Fush Yu Mang', 8, date, callback
      );
    },
    function(callback) {
      songCreate(
        "S.O.B", "Nathaniel Rateliff & The Night Sweats", "Nathaniel Rateliff & The Night Sweats", 9, date, callback
      );
    },
    function(callback) {
      songCreate(
        "Cats In The Cradle", "Harry Chapin", "Varities & Balderdash", 10, date, callback      );
    },
  ],
  cb);
}

function createUsers(cb) {
  async.series([
    function(callback) {
      userCreate('Ethan', 'Hunter', 'EHunter', 'pword1', callback);
    },
    function(callback) {
      userCreate('Megan', 'Deyoung', 'MDeyoung', 'pword2', callback);
    },
    function(callback) {
      userCreate('Logan', 'Jepson', 'LJepson', 'pword3', callback);
    },
    function(callback) {
      userCreate('Garret', 'Katayama', 'GKatayama', 'pword4', callback);
    },
    function(callback) {
      userCreate('Chadd', 'Williams', 'CWilliams', 'pword5', callback);
    },
    function(callback) {
      userCreate('Shereen', 'Khoja', 'SKhoja', 'pword6', callback);
    },
    function(callback) {
      userCreate('Doug', 'Ryan', 'TheCoolestTeacher', 'dougiscool', callback);
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
        console.log('Results: '+ results);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
