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


var rand = function(max) {
	return Math.floor(Math.random() * max);
};
// create a new set of tanks for all existing players
// Note: "this" == the game object
// Note: when this function returns, the tanks have NOT been created yet
var buildAllTanks = function(self, nTanksPerPlayer) {
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
		nowjs.getClient(sess.id, function () {
			if (this.now && this.now.setInitialTanks) {
				this.now.setInitialTanks(self.tanks);
			}
		});
	});
};

// startup the main game loop
var intervalKey = undefined;
var startGameLoop = function() {
	var self = this;
	if (!intervalKey) {
		intervalKey = setInterval(function() {
			// Time to update the game

			// @TODO: calculate elapsed ms per frame (for now, just hardcode a guess of 50)
			var msElapsed = 50;
			self.updateTanks(msElapsed);

			// @TODO: remove this temp debug test code that is monkeying with the map			
			// **** NOTE: This is the server function that changes the map, and passes the new map data to all actors/clients/browsers ****
			var md = self.map.mapData;
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
					
					// **** GAME OVER ****
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
				sendMapToClients(self,sess,arX, arV);
			});
		}, 50);	// 500ms = 2/second.  50=20/second
	}
};




// send an update/change of the map to all client browsers
var sendMapToClients = function(self, sess, arX, arV) {
	nowjs.getClient(sess.id, function () {
		var md = self.map.mapData;
		if (this.now) {
			if (this.now.defineMap) {
				// Note: FireFox takes a rather LONG time to send the map data, and sometimes it doesn't get there
				// Note: continue sending the entire map to the client, until the client replies: "gotMap"
				if (!this.now.mapSent) this.now.mapSent = 0;
				this.now.mapSent++;
				if (this.now.mapSent < 10 || !this.now.gotMap) {
					console.log("calling defineMap for "+sess.id+".   mapSent="+this.now.mapSent+".   md.width="+md.width);
					this.now.defineMap(md);
					self.sendTanks();
				}
			}
			if (this.now.updateMap) {
				this.now.updateMap(arX, arV);
			}
		}
	});
};


var newGame = (function() {
	// constructor
	// create a new Game, given a world-map-width (width)
	return function(width) {
		// DATA
		this.tanks = [];									// array of tanks
		this.map = new mapConstructor.newMap(width);		// create a new map that is N pixels wide

		// METHODS
		this.startGameLoop = startGameLoop;
		this.sendTanks = sendTanks;							// initial send all tank data to all clients
		this.updateTanks = updateTanks;						// update all tanks for N ms

		buildAllTanks(this, 3);								// build N tanks per client

		return this;
	};

})();




exports.newGame = newGame;


