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