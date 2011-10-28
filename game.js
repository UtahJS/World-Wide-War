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
var buildAllTanks = function() {
	var nextTankId = 1000;
	var nTanksPerPlayer = 3;		// each player get N tanks to start with
	sessions.runOnAllSessions(function(sess) {
		// sess = session of one of the player
		// sess.id = unique id for this player
		for(var tn=0; tn<nTanksPerPlayer; tn++) {
			// create a random tank object some where in the world
			var tankObj = {x:rand(100)+50, y:rand(30)+30, id:nextTankId, user:sess.id};
			nextTankId++;
console.log("Built tank# " + nextTankId);
		}
	});	
};

var newGame = (function() {
	var name = 'private';
	
	// constructor
	// create a new Game, given a world-map-width (width)
	return function(width) {
		this.map = new mapConstructor.newMap(width);		// create a new map that is 1000 pixels wide
		this.buildAllTanks = buildAllTanks;
		return this;
	};

})();




exports.newGame = newGame;


