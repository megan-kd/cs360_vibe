var User = require('../models/user');
var validator = require("email-validator");
var bcrypt = require("bcrypt");
var regexPassword = new RegExp('^(?=.*[A-Za-z])(?=.*?[0-9]).{8,}$');

var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2.mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// add a new user to the database from post
exports.user_create_post = function (req, res){
  // if missing any credentials  
  var message = " "
  if(!req.body.confirmpassword || !req.body.newpassword || !req.body.newusername || 
    !req.body.firstname || !req.body.lastname || !req.body.email || !req.body.securityanswer
    || !req.body.securityquestion) {
    message = "Missing required field. Account not created."
    res.render('register', {message:message});
  } 

  //incorrect password format at least 8 characters and has both letters and numbers)
  else if (!regexPassword.test(req.body.newpassword)) {

    message = "password needs 8 characters including at least one letter and one number!";
    res.render('register', {message:message});

  }
  // could not confirm password
  else if (req.body.newpassword != req.body.confirmpassword){
    message = "Passwords do not match. Account not created."
    res.render('register', {message:message});
  }
  // if email is not the correct format
  else if (!validator.validate(req.body.email)){
    message = "Invalid email. Account not created."
    res.render('register', {message:message});
  }
  // check if username already exists in database, if not add user.
  else {

    db.collection("User").findOne({username: req.body.newusername}, function(err, user){
      if(err){
        console.log(err);
      }
      if (user){
        message = "Someone already has this username. Account not created."
        res.render('register', {message:message});
      }
      else {
        // encrypt password
        // let encryptedPassWord;
        bcrypt.hash(req.body.newpassword, 10, function(err, encrypted){
          if (err){
            console.log(err);
          }
          else {
            newUser = new User({username: req.body.newusername, password: encrypted,
              email: req.body.email, securityQuestionPrompt: req.body.securityquestion,
              securityQuestionAnswer: req.body.securityanswer, firstName: req.body.firstname,
              lastName: req.body.lastname});
    
            db.collection("User").insertOne(newUser, function(err, res) {
              if (err) throw err;
              db.close();
            });
          }
          
          
        });
        
        
        res.redirect('/login');
      }
    });     
  }  
};

// add a new user to the database from get
exports.user_create_get = function (req, res){
  res.send("NOT IMPLEMENTED: Create User from Get");
};

// delete a user account from post
exports.user_delete_post = function (req, res){
  res.send("NOT IMPLEMENTED: Delete User from POST");
};
