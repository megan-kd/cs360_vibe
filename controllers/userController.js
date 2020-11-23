var User = require('../models/user');
var validator = require("email-validator");
var bcrypt = require("bcrypt");
var regexPassword = new RegExp('^(?=.*[A-Za-z])(?=.*?[0-9]).{8,}$');
let alert = require('alert');

var mongoose = require('mongoose');
const { render } = require('pug');
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

exports.user_update_account_post = function (req, res){
  // get current user through login session cookie
  let currentUser = req.session.username;
  var message = " ";

  //if first name is being changed
  if (req.body.firstname){
    db.collection("User").updateOne({username: currentUser}, 
      {$set: {'firstName': req.body.firstname}});
  }

  //if last name is being changed
  if (req.body.lastname){
    db.collection("User").updateOne({username: currentUser}, 
      {$set: {'lastName': req.body.lastname}});
  }

  //if email is being changed
  if (req.body.email){
    if (!validator.validate(req.body.email)){
      message += "\nEmail improper format. Email not updated.";
    }
    else {
      db.collection("User").updateOne({username: currentUser}, 
        {$set: {'email': req.body.email}});
    }
    
  }

   //if security question/answer being changed
  if (req.body.securityanswer){
    db.collection("User").updateOne({username: currentUser},
       {$set: {securityQuestionPrompt: req.body.securityquestion,
         securityQuestionAnswer: req.body.securityanswer}});
  }

  //credentials
  //changing username
  if (req.body.username){
    // does this username already exist?
    db.collection("User").findOne({username: req.body.username}, function(err, user){
      if(err){
        console.log(err);
      }
      //somebody already has username, not changed
      if (user){
        alert("Someone already has this username. Username not changed.");
      }
      // change username
      else {
        db.collection("User").updateOne({username: currentUser}, 
          {$set: {'username': req.body.username}});
        
          currentUser = req.body.username;
          req.session.username = req.body.username;
      }
    });

  }
  
  //changing password
  if (req.body.newpassword){
    //missing fields
    if (!req.body.currentpassword || !req.body.confirmpassword){
      message += "\nPlease enter current password and confirm new password. Password not changed."
      //res.render('updateAccount', {message: message});
    }
    // current password doesn't match current password
    db.collection("User").findOne({username: currentUser},
      function(err, user){
        if (err){
          console.log(err)
        }
        if (user){
          bcrypt.compare(req.body.password, user.password, function(err, same){
            if (!same){
              alert("Current password is incorrect. Password not changed");
            }
          });
        }

    });
    //confirm password doesn't match new password
    if (req.body.newpassword != req.body.confirmpassword){
      message += "\nNew Password and Confirm Password do not match. Password not changed."
      //res.render('updateAccount', {message: message});
    }
    //not correct password format
    else if (!regexPassword.test(req.body.newpassword)) {
      message += "\nNew password needs 8 characters including at least one" + 
                " letter and one number! Password not changed."
      //res.render('updateAccount', {message: message});
    }

    // password values are good to go
    else {
      bcrypt.hash(req.body.newpassword, 10, function(err, encrypted){
        if (err){
          console.log(err);
          alert("Error. Password not changed.");
          //res.render('updateAccount', {message: message});
        }
        else {
          db.collection("User").updateOne({username: currentUser}, 
            {$set: {'password': req.body.newpassword}});
        } 
      });

    }

  }
  message += "\nAll other fields updated."
  alert(message);
  res.redirect('/login');
}
