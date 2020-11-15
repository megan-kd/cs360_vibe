var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PlaylistSchema = new Schema(
  {
    Songs : [{type: Schema.Types.ObjectId, ref: 'Song'}],
    DateCreated : {type: Date}
  }
);

module.exports = mongoose.model('Playlist', PlaylistSchema);