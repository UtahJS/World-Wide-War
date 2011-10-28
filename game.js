// Game Handler
// A "Game" consists of multiple people and 1 map
//
// USAGE:
// var gameConstuctor = require('game');
// var myGame = new gameConstructor.newGame();
// myGame.map = the "my-game-map" object


var mapConstructor = require('./lib/map')
  , sessions = require('./lib/sessions')
  ;


var rand = function(max) {
	return Math.floor(Math.random() * max);
};
// create a new set of tanks for all existing players
// Note: "this" == the game object
var buildAllTanks = function() {
	var self = this;
	this.tanks = [];
	var nextTankId = 1000;
	var nTanksPerPlayer = 3;		// each player get N tanks to start with
	sessions.runOnAllSessions(function(sess) {
		// sess = session of one of the player
		// sess.id = unique id for this player
		for(var tn=0; tn<nTanksPerPlayer; tn++) {
			// create a random tank object some where in the world
			var tankObj = {x:rand(100)+50, y:rand(30)+30, id:nextTankId, user:sess.id};
			self.tanks.push(tankObj);
			nextTankId++;
console.log("Built tank# " + nextTankId);
		}
	});
};

// update all tanks and send changes to all clients
var updateTanks = function(ms) {
	// @TODO: move tanks based on "ms elapsed time"
	
	// @TODO: send altered tank data to everyone
	sessions.runOnAllSessions(function(sess) {
//		sendTanksToClients(sess,arX, arV);
	});
};

// send all initial tanks to all clients
var sendTanks = function() {
	var self = this;
	sessions.runOnAllSessions(function(sess) {
		if (this.now && this.now.setInitialTanks) {
			// @TODO: need to add "setInitialTanks" method on the client
			this.now.setInitialTanks(self.tanks);
		}
	});
};



var newGame = (function() {
	var name = 'private';
	
	// constructor
	// create a new Game, given a world-map-width (width)
	return function(width) {
		this.tanks = [];									// array of tanks
		this.map = new mapConstructor.newMap(width);		// create a new map that is N pixels wide
		this.buildAllTanks = buildAllTanks;					// create new tanks
		this.sendTanks = sendTanks;							// initial send all tank data to all clients
		this.updateTanks = updateTanks;						// update all tanks for N ms
		return this;
	};

})();




exports.newGame = newGame;


