/**
 * Module dependencies.
 */

var express = require('express')
  , everyone
  , example = require('./lib/example')
  , map = require('./lib/map')
  ;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

map.buildMap();
// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
  
  example.exampleMethod();
});

app.listen(3000);
everyone = require('now').initialize(app);

// initialize + configuration

// *** PUBLISH TO CLIENT: 
everyone.now.logStuff = function(msg){
    console.log(msg);
}

// *** PUBLISH TO CLIENT: "The Map Data"
everyone.now.mapData = map.mapData;


console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
