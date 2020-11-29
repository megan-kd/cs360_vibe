//**********************************************************************
// File:				song.js
// Author:		  Group #4	
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			database schema for the song collection of documents
//**********************************************************************

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongSchema = new Schema(
  {
    Title : {type: String},
    Artist : {type: String},
    Album : {type: String},
    Likes : {type: Number},
    WhoUploaded : {type: String},
    WhenUploaded : {type: Date},
    SongID: {type: String}
  }
);

module.exports = mongoose.model('Song', SongSchema);