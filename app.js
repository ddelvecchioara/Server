const express = require('express');
const router = require('./router');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const imageGetRouter = require('./imageGetter');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('../input'));
app.use(bodyParser.json());
app.use(cors());
app.use('/resolve', router);
app.use('/retrieve',imageGetRouter);

var key = fs.readFileSync('./selfsigned.key');
var cert = fs.readFileSync('./selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

app = express();
app.get('/', function (req, res) {
  res.send('Hello, Im a middle wear server for SISR');
});

var server = https.createServer(options,app);
server.listen(port, err => {
    if (err) {
      return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});




