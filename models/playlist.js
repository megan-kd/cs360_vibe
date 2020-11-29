//**********************************************************************
// File:				playlist.js
// Author:		  Group #4	
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			database schema for the playlist collection of documents
//**********************************************************************

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PlaylistSchema = new Schema(
  {
    Songs : [{type: Schema.Types.ObjectId, ref: 'Song'}],
    DateCreated : {type: Date}
  }
);

module.exports = mongoose.model('Playlist', PlaylistSchema);