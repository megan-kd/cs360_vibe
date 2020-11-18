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
    lastName: {type: String}
  }
);

module.exports = mongoose.model('User', UserSchema);