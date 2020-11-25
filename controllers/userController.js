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
              //db.close();
            });
          }
          
          
        });
        
        
        res.redirect('/login');
      }
    });     
  }  
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
      message += " Email improper format. Email not updated.";
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
    function updateSession (){
      req.session.username = req.body.username;
      currentUser = req.body.username;
      console.log(currentUser);
      console.log(req.session.username);
    }
    // does this username already exist?
    var checkUsername = db.collection("User").findOne({username: req.body.username});

    checkUsername.then(user => {
      if (user != null){
        alert(" Someone already has this username. Username not changed. Check below for any other errors.");
      }
      else {
        db.collection("User").updateOne({username: currentUser}, 
            {$set: {'username': req.body.username}});

        updateSession();
      }
    });
    
  }

  
  //changing password
  if (req.body.newpassword){
    //missing fields
    if (!req.body.confirmnewpassword){
      message += " Please confirm new password. Password not changed."
    }
    //confirm password doesn't match new password
    else if (req.body.newpassword != req.body.confirmnewpassword){
      message += " New Password and Confirm Password do not match. Password not changed."
    }
    //not correct password format
    else if (!regexPassword.test(req.body.newpassword)) {
      message += " New password needs 8 characters including at least one" + 
                " letter and one number! Password not changed."
    }
    // password values are good to go
    else {
      bcrypt.hash(req.body.newpassword, 10, function(err, encrypted){
        if (err){
          console.log(err);
          alert("Server Error. Password not changed.");
        }
        else {
          db.collection("User").updateOne({username: currentUser}, 
            {$set: {'password': encrypted}});
        } 
      });

    }

  }
  message += "All possible fields updated."
  res.render('updateAccount', {message:message});
}

// delete user from get request
exports.user_delete_from_get = function (req, res) {
  let currentUser = req.session.username;
  //delete from database
  db.collection("User").deleteOne({username: currentUser});

  // destroy current session
  req.session.destroy(function(err){
    console.log(err);
  });
  alert("Account deleted!!");
  res.redirect('/login');
  
}
// add a new user to the database from get
exports.user_create_get = function (req, res){
  res.send("NOT IMPLEMENTED: Create User from Get");
};

// delete a user account from post
exports.user_delete_post = function (req, res){
  res.send("NOT IMPLEMENTED: Delete User from POST");
};

