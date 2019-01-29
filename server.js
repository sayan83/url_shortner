'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);
var u = new mongoose.Schema({
  short: Number,
  orig: String
});
var url = mongoose.model('url',u);
var count = 1;

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res,done) {
  var orig_url = req.body.url;
  console.log(orig_url);
  url.findOne({orig: orig_url}, function(err,data){
    if (err) done(err);
    if(data == null){
      var document= new url({short: count, orig: orig_url});
      document.save(function(err,data){
        if (err) done(err);
        done(null, data);
      });
      res.send({original_url: orig_url, short_url: count});
      count++;
      done(null, data);
    }
    else
    {
      res.send({original_url: orig_url, short_url: data.short});
    }
  });
  // console.log(req.params.url);
  // res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
