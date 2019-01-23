const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Show = new Schema({
  _id: Schema.Types.ObjectId,
  showID: Number,
  poster: String,
  users: [{type: Schema.Types.ObjectId, ref: 'User'}]
}, {collection: "shows" });

module.exports = mongoose.model('Show', Show);
