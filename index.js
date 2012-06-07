var express = require('express');

var app = express.createServer();

app.use(express.logger());
app.use(express.static(__dirname + '/assets'));

app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.get('/', function(req, res) {
  res.render('index', {'target': 'susan'});
 });

app.listen(8000);
