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

var myGame;		// the variable to hold THE one game (@TODO: have a collection of games)

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

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'UtahJS: World Wide War'
  });
  
  example.exampleMethod();
});

app.listen(8000);
everyone = nowjs.initialize(app);

// *** Start a new game !!
var startNewGame = function() {
	var nPlayers = sessions.countSessions();		// total players going to play this game
	var nWide = 1500 + nPlayers * 300;				// world width
	var nTanksPerPlayer = 3;						// tanks per player
	myGame = new gameConstructor.newGame();			// create a game with a map of N pixels wide
	myGame.init(nWide, nTanksPerPlayer);			// initialize the game
	myGame.startGameLoop();							// start up the main game loop
};

// ** Track all client-browser connections (stored in "sessions")
nowjs.on('connect', function() {
	var id = this.user.clientId;
	sessions.createSessionViaNow(this.user);
	sessions.runOnAllSessions(function(sess) {
		nowjs.getClient(sess.id, function () {
			if (this.now && this.now.updatePlayerCount) {
				this.now.updatePlayerCount(sessions.countSessions());
			}
		});
	});
});
nowjs.on('disconnect', function() {
	sessions.deleteSessionViaNow(this.user);
	sessions.runOnAllSessions(function(sess) {
		nowjs.getClient(sess.id, function () {
			if (this.now && this.now.updatePlayerCount) {
				this.now.updatePlayerCount(sessions.countSessions());
			}
		});
	});
	// if no sessions, stop all games
	if (sessions.countSessions() <= 0 && myGame) {
		myGame.gameOver = true;
	}
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

everyone.now.getNumberOfPlayers = function() {
	console.log(sessions.countSessions());
	return sessions.countSessions();
}

// When any user wants to perform any action, then call this function (like "move my tank#3 left 3 pixels")
everyone.now.queueAction = function(tankID, action) {
	if (myGame && this.user && this.user.clientId) {
		// pass in the "userID" (session id)
		tankID = parseInt(tankID);
		myGame.queueAction(this.user.clientId, tankID, action);
	}
};

// initialize + configuration

// *** PUBLISH TO CLIENT: debug log function (allow client to record log messages on the server console)
everyone.now.logStuff = function(msg){
    console.log(msg);
}



console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
