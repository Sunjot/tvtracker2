const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./models/user');
const Show = require('./models/show');
const fetch = require('node-fetch');

const port = 3000;
const app = express();

dotenv.config(); // used to load env variables from .env file

app.use(session({
  secret: process.env.SESSECRET,
  cookie: {},
  resave: true,
  saveUninitialized: false,
}));
app.use(bodyParser.json()); // Used to parse JSON request body
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // set key for encrypting cookies

passport.use(User.createStrategy()); // helper method of passport-local-mongoose plugin to setup strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connection to mongoDB Atlas Cluster
var mongoURL = "mongodb+srv://sunjotsingh:" + process.env.MDBPASS + "@tvtracker-bykmv.mongodb.net/tv?retryWrites=true";
mongoose.connect(mongoURL, {useNewUrlParser: true});

var db = mongoose.connection; // Connection established
db.once('open', () => {
  console.log("Connection established to MongoDB Cluster");
});

app.post('/api/login', passport.authenticate('local'), function(req, res){
  res.status(200).send('Authorized');
  console.log("Successful Login");
});

app.get('/api/logout', function(req, res){
  req.session.destroy();
});

app.post('/api/signup', function(req, res, next) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if(err) {
      console.log("Registration failed.");
      res.status(401).send('Forbidden');
      return next(err);
    }
    req.logIn(user, function(err) { // login after registration
      if (err) return next(err);

      res.status(200).send('Authorized');
      console.log("Successful registration/authentication.");
    });
  });

  console.log(req.body);
});

// Used to check if a session is established
app.get('/api/user', function(req, res, next){
  if (!req.session) {
    res.status(401).send('Forbidden'); // no user, deny access
  }
  res.status(200).send('Authorized'); // user logged, allow access
});

app.post('/api/search', function(req, res, next){
  var searchURL = "https://api.themoviedb.org/3/search/tv?api_key="
  + process.env.TMDBKEY + "&language=en-US&page=1&query=" + req.body.query;

  fetch(searchURL, {method: 'get'}).then((res) => { return res.text(); }).then((data) => { return res.send(data) });
});

app.post('/api/add', function(req, res, next){
  if (req.session) {

    // check if show exists already in the db, and create otherwise
    Show.findOne({showID: req.body.id}, (err, show) => {
      if(!show) {
        const newShow = new Show({
          _id: new mongoose.Types.ObjectId(),
          showID: req.body.id,
          poster: req.body.poster
        });

        newShow.save();
        show = newShow;
      }

      User.findOne({username: req.session.passport.user}, function(err, user){

        var showExists = false;
        user.populate('shows', function(err, sh){
          sh.shows.map((item, x) => {
            if (item.showID === parseInt(req.body.id)) showExists = true;
          });

          if (showExists === false) {
            user.shows.push(show._id);
            user.save();
          }
        });
      });
    });
  }
});

app.listen(port, () => console.log(`Listening on ${port}`));
