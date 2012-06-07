var express = require('express');

var app = express.createServer();

app.use(express.logger());
app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
   res.send('hello worlds');
 });

app.listen(8000);
