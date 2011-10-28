/**
 * Module dependencies.
 */

var express = require('express')
  , everyone
  , example = require('./lib/example')
  , nowjs = require('now')
  , sessions = require('./lib/sessions')
  , gameConstructor = require('./game')
  ;

var app = module.exports = express.createServer();

// @TODO: instantiate "game" after people have joined, and selected a game
var myGame = new gameConstructor.newGame(1000);		// create a game with a map of 1000 pixels wide

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

myGame.map.buildMap();
// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'UtahJS: World Wide War'
  });
  
  example.exampleMethod();
});

app.listen(8008);
everyone = nowjs.initialize(app);

// ** TRY to start a new game (if one is NOt running)
var intervalKey = null;				// ID for the one-and-only map-updater-interval-timer (null means no timer is running)
var startNewGame = function() {
	var nPlayers = sessions.countSessions();		// total players going to play this game
	var nWide = 500 + nPlayers * 300;				// world width
	myGame = new gameConstructor.newGame(nWide);	// create a game with a map of N pixels wide
	myGame.map.buildMap();							// build the map
	myGame.startGameLoop();							// start up the main game loop
	return;
	
	
	if (!intervalKey) {
		// First person to join ... when the previous map has finished

		intervalKey = setInterval(function() {
			// Time to update the game

			// @TODO: calculate elapsed ms per frame
			var msElapsed = 50;
			myGame.updateTanks(msElapsed);

			// @TODO: remove this temp debug test code that is monkeying with the map			
			// **** NOTE: This is the server function that changes the map, and passes the new map data to all actors/clients/browsers ****
			var md = myGame.map.mapData;
			var arX = [];
			var arV = [];

			// alter a chunk of the map (and save each piece altered into arX and arV)
			var x = Math.floor(Math.random() * (md.width - 100));
			var startX = x;
			for (var qqq=0; qqq<50; qqq++) {
				md.data[x] -= Math.floor(Math.random() * 10);
				if (qqq > 0) md.data[x] = Math.floor(md.data[startX] + Math.random() * 10 - 8);
				if (md.data[x] < 10) {
					// game over...
					md.data[x] = 10;
					clearInterval(intervalKey);
					intervalKey = null;
					console.log("GAME OVER ... reload browser to restart game");

					sessions.runOnAllSessions(function(sess) {
						nowjs.getClient(sess.id, function () {
							if (this.now) {
								this.now.moveToStartScene();
							}
						});
					});
					
					break;
				}
				arX.push(x);
				arV.push(md.data[x]);
				x++;
			}
		
			// send map changes to all clients/browser/actors
			sessions.runOnAllSessions(function(sess) {
				sendMapToClients(sess,arX, arV);
			});
		}, 50);	// 500ms = 2/second.  50=20/second
	}
};


// send an update/change of the map to all client browsers
var sendMapToClients = function(sess, arX, arV) {
	nowjs.getClient(sess.id, function () {
		var md = myGame.map.mapData;
		if (this.now) {
			if (this.now.defineMap) {
				// Note: FireFox takes a rather LONG time to send the map data, and sometimes it doesn't get there
				// Note: continue sending the entire map to the client, until the client replies: "gotMap"
				if (!this.now.mapSent) this.now.mapSent = 0;
				this.now.mapSent++;
				if (this.now.mapSent < 10 || !this.now.gotMap) {
					console.log("calling defineMap for "+sess.id+".   mapSent="+this.now.mapSent+".   md.width="+md.width);
					this.now.defineMap(md);
					myGame.sendTanks();
				}
			}
			if (this.now.updateMap) {
				this.now.updateMap(arX, arV);
			}
		}
	});
};

// ** Track all client-browser connections (stored in "sessions")
nowjs.on('connect', function() {
	var id = this.user.clientId;
	sessions.createSessionViaNow(this.user);
});
nowjs.on('disconnect', function() {
	sessions.deleteSessionViaNow(this.user);
});

// When anyone clicks "Start Game", this function is called
everyone.now.startGame = function() {
	// create a new game
	startNewGame();
	// tell everyone to switch to the "Game Scene"
	sessions.runOnAllSessions(function(sess) {
		nowjs.getClient(sess.id, function () {
			if (this.now) {
				this.now.moveToGameScene();
			}
		});
	});
};

// initialize + configuration

// *** PUBLISH TO CLIENT: debug log function (allow client to record log messages on the server console)
everyone.now.logStuff = function(msg){
    console.log(msg);
}



console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
