//**********************************************************************
// File:				loginController.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			functions for the login functionality and user
//              authentication
//**********************************************************************

var bcrypt = require("bcrypt");
var mongoose = require('mongoose');
var mongoDB = "mongodb+srv://EthanHunter:emasters4e@cluster0.hkqs2." +
 "mongodb.net/vibe_project?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {useNewUrlParser: true,
   useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*************************************************************************
Function:    login_authenticate_post

Description: authenticate user login using form data and post request

Parameters:  req - request to server
             res - response to requester in form of web page or message

POST values: username - the unique username for the user
             password - the user's password

Returned:    None
*************************************************************************/
exports.login_authenticate_post = function (req, res) {
  let message = " ";
  if (!req.body.username || !req.body.password){
    message = "Oops! You forgot to enter a field.";
    res.render('login', {message:message});
  }
  //console.log("debug_login");
  // check if there is a user that exists with that username and password
  db.collection("User").findOne({username: req.body.username},
    function(err, user){
      if (err){
        console.log(err);
      }
      if (user){
        bcrypt.compare(req.body.password, user.password, 
        function(err, same){
          if (same){
            var ses = req.session;
            ses.username = req.body.username;
            var midnight = new Date;
            midnight.setHours(0,0,0,0);

            //midnight.setMonth(11);

            console.log(user.WhenVoted);
            db.collection("Songs").deleteMany({WhenUploaded : {$lt : midnight}});
            //insert something here to check user.WhenVoted is less than midnight and update
            //WhenVoted to empty and hasVoted to false
            db.collection("User").updateOne({username : req.body.username}, 
              {$set : {hasVoted : false, whenVoted : undefined}});

            res.redirect('/');
          }
          else {
            message = "Account not found. Credentials are incorrect.";
            res.render('login', {message:message});
            message = " ";
          }
        }); 
      }
      else {
        message = "Account not found. Credentials are incorrect.";
        res.render('login', {message:message});
        message = " ";
      }
    });
};