//var User = require('../models/user');

var bcrypt = require("bcrypt");
var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2.mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


exports.login_authenticate_post = function (req, res) {
  var message = " ";
  if (!req.body.username || !req.body.password){
    message = "Oops! You forgot to enter a field.";
    res.render('login', {message:message});
  }
  // check if there is a user that exists with that username and password
  db.collection("User").findOne({username: req.body.username},
    function(err, user){
      if (err){
        console.log(err);
      }
      // user was found, check if password is correct
      else if (user){
        bcrypt.compare(req.body.password, user.password, function(err, same){
          
          if (same){
            //log them in an create a session cookie
            var ses = req.session;
            ses.username = req.body.username;
            res.redirect('/');
          }
          else {
            message = "Account not found. Credentials are incorrect.";
            res.render('login', {message:message});
            message = " ";
          }
        }); 
      }
    });
};