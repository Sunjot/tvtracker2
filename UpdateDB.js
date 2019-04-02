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

// Fires the update function at the 4th hour (local) of every day
var j = schedule.scheduleJob('* 4 * * *', () => {
  updateAirDates();
});

function updateAirDates() {

  Show.find({}, (err, shows) => {
    shows.map(show => {
      var tvURL = "https://api.themoviedb.org/3/tv/" + show.showID + "?api_key=" + process.env.TMDBKEY;
      fetch(tvURL, {
        method: 'get'
      }).then((res) => {
        return res.json();
      }).then((data) => {
        // If the episode has another air date, update nextAir in the DB with the new date/name
        if (data.next_episode_to_air) {

          var nextDate = moment(data.next_episode_to_air.air_date);
          var currentDate = moment(show.nextAir.get('date'));

          // Compare episode air dates to see if they require updating
          if (currentDate.isBefore(nextDate)) {
            Show.findOne({showID: show.showID}, (error, sh) => {
              sh.nextAir.set('date', data.next_episode_to_air.air_date);
              sh.nextAir.set('name', data.next_episode_to_air.name);
              sh.save();
            });
            console.log("Updated " + data.original_name + " to " + data.next_episode_to_air.air_date);
          }
        }
        // If the episode has no more air dates, update nextAir in the DB with an undefined date/name
        if (!data.next_episode_to_air) {
          Show.findOne({showID: show.showID}, (error, sh) => {
            sh.nextAir.set('date', undefined);
            sh.nextAir.set('name', undefined);
            sh.save();
          });
        }
      });
    });
  });
}
