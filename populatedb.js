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

function songCreate (title, artist, album, likes, whenUploaded, whoUploaded, cb)
{

  songdetail = {
    _id: new mongoose.Types.ObjectId(),
    Title : title, 
    Artist : artist,
    Album : album,
    Likes : likes,
    WhoUploaded : whoUploaded,
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
        'Yell Fire!', 'Michael Franti & Spearhead', 'Yell Fire', 1, date, "EHunter", callback
      );
    },
    function(callback) {
      songCreate(
        'In The Air Tonight', 'Phil Collins', 'Face Value', 2, date, "MDeyoung", callback
      );
    },
    function(callback) {
      songCreate(
        "Dont Bring Me Down", 'Electric Light Orchestra', 'Discovery', 3, date, "LJepson", callback
      );
    }, 
    function(callback) {
      songCreate(
        'The Boxer', 'Simon & Garfunkel', 'A New Music City', 4, date, "GKatayama",callback
      );
    }, 
    function(callback) {
      songCreate(
        'Sweet Dreams (Are Made of This)', 'Eurythimcs, Annie Lennox & Dave Stewart', 'RCA', 5, date, "SKhoja", callback
      );
    },
    function(callback) {
      songCreate(
        'Spirit in The Sky', 'Norman Greenbaum', 'Spirit in The Sky', 6, date, "CWilliams", callback
      );
    },
    function(callback) {
      songCreate(
        'Free Bird', 'Lynyrd Skynyrd', 'Pronounced Leh-Nerd Skin-Nerd', 7, date, "TheCoolestTeacher", callback
      );
    },
    function(callback) {
      songCreate(
        "Walkin On The Sun", "Smash Mouth", 'Fush Yu Mang', 8, date, "CLane", callback
      );
    }
  ],
  cb);
}

function createUsers(cb) {
  async.series([
    function(callback) {
      userCreate('Ethan', 'Hunter', 'EHunter', 'password1', callback);
    },
    function(callback) {
      userCreate('Megan', 'Deyoung', 'MDeyoung', 'password2', callback);
    },
    function(callback) {
      userCreate('Logan', 'Jepson', 'LJepson', 'password3', callback);
    },
    function(callback) {
      userCreate('Garret', 'Katayama', 'GKatayama', 'password4', callback);
    },
    function(callback) {
      userCreate('Chadd', 'Williams', 'CWilliams', 'password5', callback);
    },
    function(callback) {
      userCreate('Shereen', 'Khoja', 'SKhoja', 'password6', callback);
    },
    function(callback) {
      userCreate('Chris', 'Lane', 'CLane', 'password7', callback);
    },
    function(callback) {
      userCreate('Doug', 'Ryan', 'TheCoolestTeacher', 'dougiscool63', callback);
    }
  ],
  cb)
}


async.series([
  createUsers,
  createSongs
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
