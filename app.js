const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const port = 3000;

app.post('/api/login', (req, res) => {
  console.log(req.body);
})

app.listen(port, () => console.log(`Listening on ${port}`));
