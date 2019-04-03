const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Show = new Schema({
  _id: Schema.Types.ObjectId,
  showID: Number,
  name: String,
  poster: String,
  genres: [String],
  nextAir: {
    type: Map,
    of: String
  },
  users: [{type: Schema.Types.ObjectId, ref: 'User'}]
}, {collection: "shows" });

module.exports = mongoose.model('Show', Show);
