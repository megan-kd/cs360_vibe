var User = require('../models/user');
var validator = require("email-validator");
var regexPassword = new RegExp("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$");

// add a new user to the database from post
exports.user_create_post = function (req, res){
  // if missing any credentials  
  var message = " "
  if(!req.body.confirmpassword || !req.body.newpassword || !req.body.newusername || 
    !req.body.firstname || !req.body.lastname || !req.body.email) {
    message = "Missing required field. Account not created."
    res.render('register', {message:message});
  } 

  //incorrect password format at least 8 characters and has both letters and numbers)
  else if (!regexPassword.test(req.body.newpassword)) {
    message = "Password Invalid. Must have at least 8 characters, letters and numbers. Account not created."
    res.render('register', {message:message});

  }
  // could not confirm password
  else if (req.body.newpassword != req.body.confirmpassword){
    var message = "Passwords do not match. Account not created."
    res.render('register', {message:message});
  }
  // if email is not the correct format
  else if (!validator.validate(req.body.email)){
    var message = "Invalid email. Account not created."
    res.render('register', {message:message});
  }
  // check if username already exists in database
  else {
    
   res.send("success");
  /* Users.filter(function(user){
       if(user.id === req.body.id){
          res.render('signup', {
             message: "User Already Exists! Login or choose another user id"});
       }
    });
    var newUser = {id: req.body.id, password: req.body.password};
    Users.push(newUser);
    req.session.user = newUser;
    res.redirect('/protected_page');
 }*/
  
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