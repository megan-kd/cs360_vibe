//**********************************************************************
// File:				user.js
// Author:		  Group #4	
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			database schema for the user collection of documents
//**********************************************************************

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    firstName: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    SpotifyUsername: {type: String},
    SpotifyPassword: {type: String},
    addedSongToday: {type: Boolean},
    LikeSongs: [{type: Schema.Types.ObjectId, ref: 'Song'}],
    securityQuestionPrompt : {type: String},
    securityQuestionAnswer : {type: String},
    email : {type: String},
    firstName: {type: String},
    lastName: {type: String},
    hasVoted: {type: String}
  }
);

module.exports = mongoose.model('User', UserSchema);