/**
 * Module dependencies.
 */

var express = require('express')
  , everyone
  , example = require('./lib/example')
  , map = require('./lib/map')
  , nowjs = require('now')
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
    title: 'UtahJS: World Wide War'
  });
  
  example.exampleMethod();
});

app.listen(8000);
everyone = nowjs.initialize(app);

// ** TRY to start a new game (if one is NOt running)
var intervalKey = null;				// ID for the one-and-only map-updater-interval-timer (null means no timer is running)
var startNewGame = function() {
	if (!intervalKey) {
		// First person to join ... when the previous map has finished
		map.buildMap();			// re-build the map

		// interval vars
		var nextX = 0;

		intervalKey = setInterval(function() {
			// **** NOTE: This is the server function that changes the map, and passes the new map data to all actors/clients/browsers ****
			var md = map.mapData;
			var arX = [];
			var arV = [];

			for (var qqq=0; qqq<50; qqq++) {
				var x = nextX;
				md.data[x] -= Math.random() * 10;
				if (md.data[x] < 10) {
					// game over...
					md.data[x] = 10;
					clearInterval(intervalKey);
					intervalKey = null;
					console.log("GAME OVER ... reload browser to restart game");
				}
				arX.push(x);
				arV.push(md.data[x]);
				nextX += 1;//Math.floor(Math.random() * 5);
				if (nextX >= md.width) {
					nextX = 0;
					console.log("Interval... width="+md.width);
				}
			}
		
			for(var i in actors) {
				(function(theX) {
					nowjs.getClient(i, function () {
						if (this.now) {
							if (this.now.defineMap) {
								// Note: FireFox takes a rather LONG time to send the map data, and sometimes it doesn't get there
								// Note: continue sending the entire map to the client, until the client replies: "gotMap"
								if (!this.now.mapSent) this.now.mapSent = 0;
								this.now.mapSent++;
								if (this.now.mapSent < 10 || !this.now.gotMap) {
									console.log("calling defineMap for "+i+".   mapSent="+this.now.mapSent+".   md.width="+md.width);
									this.now.defineMap(md);
								}
							}
							if (this.now.updateMap) {
								this.now.updateMap(arX, arV);
							}
						}
					});
				})(x);
			}
		}, 50);	// 500ms = 2/second.  50=20/second
	}
};

// ** Track all client-browser connections (stored in "actors")
var actors = [];					// actors = collection of "Now" clients
var numActors = 0;
nowjs.on('connect', function() {
	actors[this.user.clientId] = {x: 0, y: 0};
	numActors++;
	console.log("Client just connected.  Total connected="+actors.length+" == " + numActors);
	console.dir(this.user);
	startNewGame();
});
nowjs.on('disconnect', function() {
  for(var i in actors) {
    if(i == this.user.clientId) {
      delete actors[i];
      break;
    }
  }
	numActors--;
	console.log("Client just DISCONNECTED.  Total connected="+actors.length+" == " + numActors);
});


// initialize + configuration

// *** PUBLISH TO CLIENT: "The Map Data" (@TODO: don't publish 1 game's map to "everyone" -- when we allow multiple games running)
//everyone.now.mapData = map.mapData;

// *** PUBLISH TO CLIENT: debug log function (allow client to record log messages on the server console)
everyone.now.logStuff = function(msg){
    console.log(msg);
}



console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
