var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongSchema = new Schema(
  {
    Title : {type: String},
    Artist : {type: String},
    Album : {type: String},
    Likes : {type: Number},
    WhoUploaded : {type: Schema.Types.ObjectId, ref: 'User'},
    WhenUploaded : {type: Date}
  }
);

module.exports = mongoose.model('Song', SongSchema);