const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const User = require('./models/user');

const port = 3000;
const app = express();

app.use(bodyParser.json()); // Used to parse JSON request body
app.use(cookieParser()); // For parsing cookie header
app.use(passport.initialize()); // initialize passport
app.use(passport.session({secret: process.env.SESSECRECT})); // set key for encrypting cookies

passport.use(User.createStrategy()); // helper method of passport-local-mongoose plugin to setup strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

dotenv.config(); // used to load env variables from .env file

// Connection to mongoDB Atlas Cluster
var mongoURL = "mongodb+srv://sunjotsingh:" + process.env.MDBPASS + "@tvtracker-bykmv.mongodb.net/tv?retryWrites=true";
mongoose.connect(mongoURL, {useNewUrlParser: true});

var db = mongoose.connection; // Connection established
db.once('open', () => {
  console.log("Connection established to MongoDB Cluster");
});

app.post('/api/login', (req, res) => {
  console.log(req.body);
})

app.post('/api/signup', function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password, function(err) {
    if(err) {
      console.log("didnt work");
      return next(err);
    }
    console.log("Worked");
  });

  console.log(req.body);
});

app.listen(port, () => console.log(`Listening on ${port}`));
