// Game Handler
// A "Game" consists of multiple people and 1 map
//
// USAGE:
// var gameConstuctor = require('game');
// var myGame = new gameConstructor.newGame();


var mapConstructor = require('./lib/map')
  ;



var newGame = (function() {
	var name = 'private';
	var map;
	
	// constructor
	return function(width) {
		map = new mapConstructor.newMap(width);		// create a new map that is 1000 pixels wide
		this.name = name;
	};

})();


exports.newGame = newGame;

//var game = require('game').newGame('My Name');

