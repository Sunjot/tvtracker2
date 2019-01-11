const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

var User = new Schema({
  username: String,
  password: String
}, {collection: "users"});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
