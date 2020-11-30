//**********************************************************************
// File:				userController.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			functions to access the user model when requested,
//              return an HTML page for the user to view in the 
//              browser
//**********************************************************************
var User = require('../models/user');
var validator = require("email-validator");
var bcrypt = require("bcrypt");
var regexPassword = new RegExp('^(?=.*[A-Za-z])(?=.*?[0-9]).{8,}$');
let alert = require('alert');

var mongoose = require('mongoose');
const { render } = require('pug');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2." +
 "mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true,
   useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*************************************************************************
Function:    user_create_post

Description: add a new user to the database from a request

Parameters:  req - request to server
             res - response to requester in form of web page or message

POST values: newusername - the unique username for the new user
             newpassword - the new user's password
             confirmnewpassword - a matching password to confirm the input
             email - user's new email
             firstname - user's first name
             lastname - user's last name
             securityquestion - a prompt for the user's security question
             securityanswer - answer to the security question

Returned:    None
*************************************************************************/

exports.user_create_post = function (req, res){ 
  let message = " ";
  let bAddUser = true;
  if(!req.body.confirmpassword || !req.body.newpassword 
      || !req.body.newusername || !req.body.firstname 
      || !req.body.lastname || !req.body.email || !req.body.securityanswer
      || !req.body.securityquestion) {
    message += "Missing required field. "
  } 

  if (!regexPassword.test(req.body.newpassword)) {

    message += "Password needs 8 characters including at" + 
    " least one letter and one number! ";

    bAddUser = false;

  }
  if (req.body.newpassword != req.body.confirmpassword){
    message += "Passwords do not match. ";
    bAddUser = false;
  }
  if (!validator.validate(req.body.email)){
    message += "Invalid email. ";
    bAddUser = false;
  }
  if (bAddUser == true){
    db.collection("User").findOne({username: req.body.newusername}, 
    function(err, user){
      if(err){
        console.log(err);
      }
      if (user){
        message = "Someone already has this username. Account not created.";
        res.render('register', {message:message});
      }
      else {
        bcrypt.hash(req.body.newpassword, 10, function(err, encrypted){
          if (err){
            console.log(err);
          }
          else {
            newUser = new User({username: req.body.newusername,
              password: encrypted, email: req.body.email,
              securityQuestionPrompt: req.body.securityquestion,
              securityQuestionAnswer: req.body.securityanswer,
              firstName: req.body.firstname, lastName: req.body.lastname, 
              hasVoted: false});
    
            db.collection("User").insertOne(newUser, function(err, res) {
              if (err) throw err;
            });
          } 
        });
        
        res.redirect('/login');
      }
    });     
  }
  else {
    message += " Account not created."
    res.render('register', {message:message});  
  }
  
};

/*************************************************************************
Function:    user_update_account_post

Description: update existing user in the database's with form data from
             a post request by using the username stored in the login
             session

Parameters:  req - request to server
             res - response to requester in form of web page or message

POST values: newpassword - the new user's password
             confirmpassword - a matching password to confirm the input
             email - user's new email
             firstName - user's first name
             lastName - user's last name
             securityquestion - a prompt for the user's security question
             securityanswer - answer to the security question

Returned:    None
*************************************************************************/
exports.user_update_account_post = function (req, res){
  let currentUser = req.session.username;
  let message = " ";

  if (req.body.firstname){
    db.collection("User").updateOne({username: currentUser}, 
      {$set: {'firstName': req.body.firstname}});
  }

  if (req.body.lastname){
    db.collection("User").updateOne({username: currentUser}, 
      {$set: {'lastName': req.body.lastname}});
  }

  if (req.body.email){
    if (!validator.validate(req.body.email)){
      message += " Email improper format. Email not updated.";
    }
    else {
      db.collection("User").updateOne({username: currentUser}, 
        {$set: {'email': req.body.email}});
    }
    
  }

  if (req.body.securityanswer){
    db.collection("User").updateOne({username: currentUser},
       {$set: {securityQuestionPrompt: req.body.securityquestion,
         securityQuestionAnswer: req.body.securityanswer}});
  }

  if (req.body.username){
    function updateSession (){
      req.session.username = req.body.username;
      currentUser = req.body.username;
      console.log(currentUser);
      console.log(req.session.username);
    }
    var checkUsername = db.collection("User").findOne(
      {username: req.body.username});

    checkUsername.then(user => {
      if (user != null){
        alert(" Someone already has this username. Username not changed." + 
        " Check below for any other errors.");
      }
      else {
        db.collection("User").updateOne({username: currentUser}, 
            {$set: {'username': req.body.username}});

        updateSession();
      }
    });
    
  }

  if (req.body.newpassword){
    if (!req.body.confirmnewpassword){
      message += " Please confirm new password. Password not changed."
    }
    else if (req.body.newpassword != req.body.confirmnewpassword){
      message += " New Password and Confirm Password do not match." +
       " Password not changed."
    }
    else if (!regexPassword.test(req.body.newpassword)) {
      message += " New password needs 8 characters including at least one" + 
                " letter and one number! Password not changed."
    }
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

/*************************************************************************
Function:    user_delete_from_get

Description: delete user from the database with a get request

Parameters:  req - request to server
             res - response to requester in form of web page or message

Returned:    None
*************************************************************************/
exports.user_delete_from_get = function (req, res) {
  let currentUser = req.session.username;
  db.collection("User").deleteOne({username: currentUser});

  req.session.destroy(function(err){
    console.log(err);
  });
  alert("🥺 👉🏼👈🏼 Account deleted!!");
  res.redirect('/login');
  
}

/*************************************************************************
Function:    user_reset_password_post

Description: reset user's password through a post request if they forget 
             it 

Parameters:  req - request to server
             res - response to requester in form of web page or message

POST values: username - the user's username to identify who to update
             newpassword - the new user's password
             confirmpassword - a matching password to confirm the input
             email - user's email to verify user
             securityquestion - a prompt for the user's security question
             securityanswer - answer to the security question

Returned:    None
*************************************************************************/
exports.user_reset_password_post = function (req, res){
  function authenticateUserInfo(user){
    if (user.email != req.body.email){
      res.render('resetPassword', {message: "Email is incorrect." + 
        "Password reset failed"});
    }
    else if (user.securityQuestionPrompt != req.body.securityquestion 
      || user.securityQuestionAnswer != req.body.securityanswer){
        res.render('resetPassword', {message: "Security Question input" +
         " is not correct. Password reset failed."});
    }
    else if (!regexPassword.test(req.body.newpassword)){
      res.render('resetPassword', {message:"New password needs to be 8" +
       " characters and include at least one letter and one number." + 
       " Password reset failed."});
    }
    else if (req.body.newpassword != req.body.confirmpassword){
      res.render('resetPassword', {message: "Password not confirmed." +
       " Password reset failed"});
    }
    else {
      bcrypt.hash(req.body.newpassword, 10, function(err, encrypted){
        if (err){
          console.log(err);
          alert("Server Error. Password reset failed.");
        }
        else {
          db.collection("User").updateOne({username: req.body.username}, 
            {$set: {'password': encrypted}});
        } 
      });
      alert("Password reset! Go ahead and login.");
      res.redirect('/login');
    }
  }
  let getUser = db.collection("User").findOne(
    {username: req.body.username});

  getUser.then(user => {
    if (user == null){
      res.render('resetPassword',
       {message: "User not found, username is incorrect. Password reset "
        + "failed."});
    }
    else {
      authenticateUserInfo(user);
    }
  });

}