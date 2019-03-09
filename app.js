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
const MongoStore = require('connect-mongo')(session);

const port = 3000;
const app = express();

dotenv.config(); // used to load env variables from .env file

// Connection to mongoDB Atlas Cluster
var mongoURL = "mongodb+srv://sunjotsingh:" + process.env.MDBPASS + "@tvtracker-bykmv.mongodb.net/tv?retryWrites=true";
mongoose.connect(mongoURL, {useNewUrlParser: true}).catch(function(err) {
  console.log("Error connecting to DB: " + err);
});

app.use(session({
  secret: process.env.SESSECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}) // save session to mongo db
}));
app.use(bodyParser.json()); // Used to parse JSON request body
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // set key for encrypting cookies

passport.use(User.createStrategy()); // helper method of passport-local-mongoose plugin to setup strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var db = mongoose.connection; // Connection established
db.once('open', () => {
  console.log("Connection established to MongoDB Cluster");
});

// Check if a user is logged in
function isLogged(req, res, next) {
  if (req.user) next();
  else res.send('Forbidden');
}

// Authenticate user during login
app.post('/api/login', passport.authenticate('local'), function(req, res){
  res.status(200).send('Authorized');
  console.log("Successful Login");
});

// De-authenticate user during logout
app.post('/api/logout', function(req, res){
  req.logout();
  req.session.destroy();
});

// Register user
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

});

// Used to check if a session is established
app.get('/api/user', function(req, res, next){
  if (!req.user) {
    res.status(401).send('Invalid'); // no user, deny access
  }
  else {
    res.status(200).send('Valid'); // user logged, allow access
  }
});

// Make API call to TMDb for searching shows and send results back to client
app.post('/api/search', isLogged, function(req, res, next){
  var searchURL = "https://api.themoviedb.org/3/search/tv?api_key="
  + process.env.TMDBKEY + "&language=en-US&page=1&query=" + req.body.query;

  fetch(searchURL, {method: 'get'}).then((res) => { return res.text(); }).then((data) => { return res.send(data) });
});

app.post('/api/remove', isLogged, function(req, res, next){

  // Check if a show exists before attempting to remove
  
});

// Add show to User's show collection
app.post('/api/add', isLogged, function(req, res, next){

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

    User.findOne({username: req.user.username}, function(err, user){

      if (!user) res.status(401).send('Invalid');

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

      res.status(200).send('Valid');
    });
  });
});

app.listen(port, () => console.log(`Listening on ${port}`));
