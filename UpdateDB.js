const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Show = require('./models/show');
const fetch = require('node-fetch');
var moment = require('moment');
var schedule = require('node-schedule');

dotenv.config();

// Connection to mongoDB Atlas Cluster
var mongoURL = "mongodb+srv://sunjotsingh:" + process.env.MDBPASS + "@tvtracker-bykmv.mongodb.net/tv?retryWrites=true";
mongoose.connect(mongoURL, {useNewUrlParser: true}).catch(function(err) {
  console.log("Error connecting to DB: " + err);
});

var db = mongoose.connection; // Connection established
db.once('open', () => {
  console.log("Connection established to MongoDB Cluster");
});

var index = 0; // Tracks total amount of shows updated; reverts to 0 when all updated
var tracker = 0; // Tracks how many shows (0 to 40) have been updated for the current fired schedule

// Fires the update function at the 59th minute of every hour
var j = schedule.scheduleJob('59 * * * *', () => {
  updateAirDates();
});

// manualUpdateAirDates();

var index = 0;
async function getShow(show) {
  index = index + 1;
  var tvURL = "https://api.themoviedb.org/3/tv/" + show.showID + "?api_key=" + process.env.TMDBKEY;
  fetch(tvURL, {
    method: 'get'
  }).then((res) => {
    return res.json();
  }).then((data) => {

    Show.findOne({showID: show.showID}, (error, sh) => {

      // If the episode has another air date, update nextAir in the DB with the new date/name
      if (data.next_episode_to_air) {
        var nextDate = moment(data.next_episode_to_air.air_date);
        var currentDate = moment(show.nextAir.get('date'));

        // Compare episode air dates to see if they require updating
        if (currentDate.isBefore(nextDate)) {
          sh.nextAir.set('date', data.next_episode_to_air.air_date);
          sh.nextAir.set('name', data.next_episode_to_air.name);
          console.log("Updated " + data.original_name + " to " + data.next_episode_to_air.air_date);
        }
      }

      console.log(data.original_name + " and " + sh.nextAir.get('date'));
      // If the episode has no more air dates, update nextAir in the DB with an undefined date/name
      if (!data.next_episode_to_air && sh.nextAir.get('date') != undefined) {
        sh.nextAir.set('date', undefined);
        sh.nextAir.set('name', undefined);
        console.log("Updated " + data.original_name + " to no future episode air date");
      }

      if (data.poster_path != show.poster) {
        sh.poster = data.poster_path;
      }

      sh.save();
    });
  });
}

function updateAirDates() {

  Show.find({}, (err, shows) => {
    shows.slice(index, index+40).map(show => {
      getShow(show);
      tracker = tracker+1;
    });
    if (tracker !== 40) index = 0;
    tracker = 0;
  });
}

/*function manualUpdateAirDates() {

  Show.find({}, (err, shows) => {
    shows.slice(0, 40).map(show => getShow(show));

    // API limit of 40 every 10 seconds puts restriction on number of API calls
    // So for every 40 shows that exist, we delay by 20s (to be sure)
    // Could not use these in a loop since loops are synchronous
    // Assuming a maximum of 200 shows
    setTimeout(() => {
      shows.slice(40, 80).map(show => getShow(show));

      setTimeout(() => {
        shows.slice(80, 120).map(show => getShow(show));

        setTimeout(() => {
          shows.slice(120, 160).map(show => getShow(show));

          setTimeout(() => shows.slice(160, 200).map(show => getShow(show)), 20000);
        }, 20000);
      }, 20000);
    }, 20000);
  });
}*/
