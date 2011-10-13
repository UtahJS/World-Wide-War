


var newGame = (function() {
	var name = 'private';
	
	// constructor
	return function(name){
		this.name = name;
	}
})();


exports.newGame = newGame;

//var game = require('game').newGame('My Name');

