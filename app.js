const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const port = 3000;
const app = express();

app.use(bodyParser.json()); // Used to parse JSON request body

dotenv.config(); // used to load env variables from .env file

// Connection to mongoDB Atlas Cluster
var mongoURL = "mongodb+srv://sunjotsingh:" + process.env.MDBPASS + "@tvtracker-bykmv.mongodb.net/test?retryWrites=true";
mongoose.connect(mongoURL, {useNewUrlParser: true});

var db = mongoose.connection; // Connection established
db.once('open', () => {
  console.log("Connection established to MongoDB Cluster");
});

app.post('/api/login', (req, res) => {
  console.log(req.body);
})

app.listen(port, () => console.log(`Listening on ${port}`));
