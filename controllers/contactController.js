//**********************************************************************
// File:				contactController.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			functions for the contact form functionality
//**********************************************************************

let bcrypt = require('bcrypt');
let validator = require('email-validator');
let nodemailer = require('nodemailer');

exports.sendQuestionsCommentsConcerns_post = function (req, res) {
  var message = " ";

  if (!req.body.email || !req.body.questionsCommentsConcerns) {
    message = "Oops! You forgot to enter a field.";
    res.render('contact', {message: message});
  }
  
  else {
    if (!validator.validate(req.body.email)) {
      message = "Please enter a valid email address."
      res.render('contact', {message: message});
    }

    else {
      const HALF_A_DAY = 12;
      const DOUBLE_DIGITS = 10;
      const EMAIL_SERVICE = 'gmail';
      const AUTOMATED_EMAIL = 'playlist.of.the.day.project@gmail.com';
      const RESPONDER_EMAIL = 'kata3785@pacificu.edu';

      let current = new Date();

      let date = current.getMonth() + "/" + current.getDay() + "/" + current.getFullYear();
      
      let time;
      
      let minutes = current.getMinutes();
      if (DOUBLE_DIGITS > minutes) {
        minutes = '0' + minutes;
      }
      
      let hours = current.getHours();
      if (HALF_A_DAY > hours) {
        if (0 === hours) {
          hours = HALF_A_DAY;
        }
        time = hours + ':' + minutes + ' AM';
      }
      else {
        if (HALF_A_DAY !== hours) {
          hours -= HALF_A_DAY;
        }
        time = hours + ':' + minutes + ' PM';
      }
      
      let transport = nodemailer.createTransport({
        service: EMAIL_SERVICE,
        auth: {
          user: AUTOMATED_EMAIL,
          pass: 'playlistoftheday'
        }
      });

      let subjectToUser = 'Your message has been received!';

      let textToUser = '<p>Your message has been received and we will be responding as soon as possible.</p>';
      textToUser += '<p>Consider adding <em>' + RESPONDER_EMAIL + '</em> to your contact list.</p>';

      let mailOptionsToUser = {
        from: AUTOMATED_EMAIL,
        to: req.body.email,
        subject: subjectToUser,
        html: textToUser
      };

      let subjectToResponder = 'Message from ' + req.body.email;

      let textToResponder = '<p>You have received the following message:</p>';
      textToResponder += '<p><b>User: </b>' + req.body.email + '</p>';
      textToResponder += '<p><b>Date: </b>' + date + '</p>';
      textToResponder += '<p><b>Time: </b>' + time + '</p>';
      textToResponder += '<p><b>Content: </b>' + req.body.questionsCommentsConcerns + '</p>';

      let mailOptionsToResponder = {
        from: AUTOMATED_EMAIL,
        to: RESPONDER_EMAIL,
        subject: subjectToResponder,
        html: textToResponder
      };

      transport.sendMail(mailOptionsToUser, function(error){
        if (error) {
          console.log(error);
        }
      });

      transport.sendMail(mailOptionsToResponder, function(error){
        if (error) {
          console.log(error);
        }
      });

      message = "Your message has been sent!";
      res.render('contact', {message: message});
    }
  }
};