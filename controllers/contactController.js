//**********************************************************************
// File:				contactController.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			functions for the contact form functionality
//**********************************************************************

let validator = require('email-validator');
let nodemailer = require('nodemailer');
let crypto = require('crypto');

/*************************************************************************
Function:    getSentTime

Description: Gets the date and time message was sent at

Parameters:  None

Returned:    date   - date message was sent on
             time   - time message was sent at
*************************************************************************/

function getSentTime() {
  const HALF_A_DAY = 12;
  const DOUBLE_DIGITS = 10;
  
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

  return {
    date,
    time
  };
}

/*************************************************************************
Function:    sendQuestionsCommentsConcerns_post

Description: Checks for validity and sends the contact form textfield 
             message and basic message info in an email to a live person.
             Sends a confimation email to user confirming that their 
             message has been received.

Parameters:  req - request to server
             res - response to requester in form of web page or message

Returned:    None
*************************************************************************/

exports.sendQuestionsCommentsConcerns_post = function (req, res) {
  const EMAIL_SERVICE = 'gmail';
  const AUTOMATED_EMAIL = 'playlist.of.the.day.project@gmail.com';
  const HASHED_AUTH = 'dfca554828fd764ff9e57fa180da3bce1ff262e8e7ed29dd7456c21a20cebece';
  const RESPONDER_EMAIL = 'kata3785@pacificu.edu';
  const ALGORITHM = 'aes-128-cbc';

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
      let sentTime = getSentTime();
      
      let decrypt = crypto.createDecipher(ALGORITHM, 'authentication');
      let decrypted = decrypt.update(HASHED_AUTH, 'hex', 'utf8');
      decrypted += decrypt.final('utf8');
      
      let transport = nodemailer.createTransport({
        service: EMAIL_SERVICE,
        auth: {
          user: AUTOMATED_EMAIL,
          pass: decrypted
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
      textToResponder += '<p><b>User email: </b>' + req.body.email + '</p>';
      textToResponder += '<p><b>Date: </b>' + sentTime.date + '</p>';
      textToResponder += '<p><b>Time: </b>' + sentTime.time + '</p>';
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