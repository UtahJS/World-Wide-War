// Game Handler
// A "Game" consists of multiple people and 1 map
//
// USAGE:
// var gameConstuctor = require('game');
// var myGame = new gameConstructor.newGame();
// myGame.map = the "my-game-map" object


var mapConstructor = require('./lib/map')
  ;



var newGame = (function() {
	var name = 'private';
	
	// constructor
	return function(width) {
		this.map = new mapConstructor.newMap(width);		// create a new map that is 1000 pixels wide
		return this;
	};

})();


exports.newGame = newGame;

