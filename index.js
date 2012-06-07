var express = require('express');

var app = express.createServer();
var request = require('request');
var _ = require('underscore')._;

app.use(express.logger());
app.use(express.static(__dirname + '/assets'));
app.use(express.bodyParser());

app.helpers({
    title: 'heavy petting industries',
    siteName: 'heavy-petting.com'
  });

app.set('view engine', 'jade');
app.set('view options', { layout: false });

var loadRecord = function(database) {
  return function(req, res, next) {
   var url = 'http://127.0.0.1:5984/' + database + '/'+req.params.id;

   request({url: url, json: true}, function(err, resp, data) {
       if (err) return res.send(500);

       req._data = data;
       next();
     });
  };
};


function listRecords(req, res, next) {
   var url = 'http://127.0.0.1:5984/petshop/_all_docs?include_docs=true';

   request({url: url, json: true}, function(err, resp, data) {
       if (err) return res.send(500);

       req._data = _(data.rows).pluck('doc');
       next();
   });
}


function saveRecord(req, res, next) {
  var url = 'http://127.0.0.1:5984/petshop/'+req.body.id;

  request({
      url: url,
      method: 'PUT',
      json: true,
      body: JSON.stringify(req.body)
  }, function(err, resp, data) {
      if (err) return res.send(500);

      if (data.ok && data.id) {
          return res.redirect('/animal/'+data.id);
      }
      // todo: put in error handling

      req._data = data;
      next();
  });
}

 app.get('/animal/:id.json', loadRecord('heavy-petting'), function(req, res) {
    res.send(req._data);
 });

app.get('/animal/:id', loadRecord('petshop'),  function(req, res) {
   res.render('animal', req._data);
 });

app.get('/',listRecords, function(req, res) {
  res.render('index', {records: req._data});
});

var showForm = function(req, res) {
  res.render('addAnimal');
};

app.post('/add/animal',saveRecord,  showForm);

app.get('/add/animal',showForm );

app.listen(8000);
