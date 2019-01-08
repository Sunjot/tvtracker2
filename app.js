const express = require('express');
const app = express();

const port = 3000;

app.get('/test', (req, res) => {
  res.send('Hello Maam'));
  console.log("Worked");
}

app.listen(port, () => console.log(`Listening on ${port}`));
