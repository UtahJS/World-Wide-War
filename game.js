// Game Handler
// A "Game" consists of multiple people and 1 map
//
// USAGE:
// var gameConstuctor = require('game');
// var myGame = new gameConstructor.newGame();
// myGame.map = the "my-game-map" object


var mapConstructor = require('./lib/map')
  , sessions = require('./lib/sessions')
  , nowjs = require('now')
  , tankConstructor = require('./lib/tank')
  ;

// helper function: select a random number between 0 and max-1
var rand = function(max) {
	return Math.floor(Math.random() * max);
};

// initialize this game object for a whole new game
// @param {number} width  The width of the world
// @param {number) [nTanksPerPlayer]  The number of tanks each player starts with (defaults to 3)
var init = function(width, nTanksPerPlayer) {
	if (!nTanksPerPlayer) nTanksPerPlayer = 3;
	this.buildTheMap(width);
	this.buildAllTanks(nTanksPerPlayer);
};

// create the map of the world
var buildTheMap = function(width) {
	this.map = new mapConstructor.newMap(width);		// create a new map that is N pixels wide
	this.map.buildMap();
};

// create a new set of tanks for all existing players
// Note: when this function returns, the tanks have NOT been created yet
var buildAllTanks = function(nTanksPerPlayer) {
	var self = this;
	this.tanks = [];
	sessions.runOnAllSessions(function(sess) {
		// sess = session of one of the player
		// sess.id = unique id for this player
		for(var tn=0; tn<nTanksPerPlayer; tn++) {
			// create a random tank object some where in the world
			var tankObj = new tankConstructor.newTank(sess.id);
			tankObj.initTank(self.map);
			self.tanks.push(tankObj);
		}
	});
};

// update all tanks and send changes to all clients
var updateTanks = function(msElapsed) {
	var self = this;
	// move tanks based on "ms elapsed time"
	for(var i=0; i<this.tanks.length; i++) {
		this.tanks[i].update(msElapsed);
	}
	// @TODO: generate an array of the "dirty tanks" to send, instead of every tank
	sessions.runOnAllSessions(function(sess) {
		// sess = session of one of the player
		// sess.id = unique id for this player
		nowjs.getClient(sess.id, function () {
			// Note: 'this" == "now client"
			if (this.now && this.now.updateTanks) {
				this.now.updateTanks(self.tanks);			// send tank collection
			}
		});
	});	
};


// Note: FireFox takes a rather LONG time to send the map data, and sometimes it doesn't get there
// Note: continue sending the entire map to the client, until the client replies: "gotMap"
var sendInitialStateToAllClients = function(msElapsed) {
	var self = this;
	if (!this.msSinceSentInitial) this.msSinceSentInitial = 0;				// ms elapsed since sent last "initial state" to all clients
	if (!this.timesSentInitial) this.timesSentInitial = 0;					// count total times sent the initial state to all
	if (this.timesSentInitial < 20) {
		this.msSinceSentInitial += msElapsed;
	
		// re-send data every 1/4 second
		if (this.msSinceSentInitial > 500) {
			this.msSinceSentInitial = 0;
			sessions.runOnAllSessions(function(sess) {
				self.timesSentInitial++;
				nowjs.getClient(sess.id, function () {
					// Note: 'this" == "now client"
					if (this.now && !this.now.gotMap) {
						// client has NOT received map from server yet
						console.log("GAME: sending initial data to "+sess.id);
						self.map.sendInitialData(sess);					// send world map
						this.now.setInitialTanks(self.tanks);			// send tank collection
					}
				});
			});
		}
	}
};

// part of the main game loop.  Process one game loop.
// "msElapsed" milliseconds have elapsed since the last game loop was processed
var processOneLoop = function(msElapsed) {
	var self = this;
	// Time to update the game for 1 frame
	
	
	// allow everything to "process time"
	this.updateTanks(msElapsed);				// move tanks (and send data to all clients)
	this.map.updateMap(msElapsed);				// shift dirt on world (and send data to all clients)
	
	// send data to clients
	this.sendInitialStateToAllClients(msElapsed);
	
	// @TODO: determine if the game is over
	if (this.msTotalElapsed > 10000) {			// let play for 10 second, then quit (DEBUG)
		this.gameOver = true;
	}
};

// startup the main game loop
var intervalKey = undefined;
var startGameLoop = function() {
	this.msTotalElapsed = 0;			// total ms elapsed since game loop started
	this.gameOver = false;				// flag to indicate GAME OVER
	var self = this;
	if (!intervalKey) {
		intervalKey = setInterval(function() {
			// @TODO: calculate elapsed ms per frame (for now, just hardcode a guess of 50)
			var msElapsed = 50;
			self.msTotalElapsed += msElapsed;
			self.processOneLoop(msElapsed);
			if (self.gameOver) {
				// **** GAME OVER ****
				clearInterval(intervalKey);
				intervalKey = null;
				console.log("GAME OVER ... reload browser to restart game");
				// tell every browser to bo back to the "start screen" (game over)
				sessions.runOnAllSessions(function(sess) {
					nowjs.getClient(sess.id, function () {
						if (this.now) {
							this.now.moveToStartScene();
							// @TODO: reset all game data in the "now" space
							this.now.gotMap = false;
						}
					});
				});
			}
		}, 50);	// 500ms = 2/second.  50=20/second
	}
};




// constructor to create a whole new game
var newGame = (function() {
	// constructor
	// create a new Game, given a world-map-width (width)
	return function(width) {
		// DATA
		this.tanks = [];									// array of tanks
		this.map;											// THE map of the world

		// METHODS
		this.init = init;									// initialize a whole new game
		this.buildTheMap = buildTheMap;
		this.buildAllTanks = buildAllTanks;
		this.processOneLoop = processOneLoop;
		this.startGameLoop = startGameLoop;					// startup the main game loop
		this.updateTanks = updateTanks;						// update all tanks for N ms
		this.sendInitialStateToAllClients = sendInitialStateToAllClients;

		return this;
	};

})();




exports.newGame = newGame;


