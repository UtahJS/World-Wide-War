// Tank handler
// A "Tank" is a single tank that has a location, facing-direction, turret-angle, owner
// Each user can have multiple tanks under their control
// The world has many tanks on it
// Note: the tank position is the MIDDLE-BOTTOM of the tank.  The "^" points at the tank position below:
//                O------
//             xxxxxxx
//             x     x
//             xxxxxxx
//	--------------^----------------
//
//
// USAGE:
// var tankConstructor = require('tank');
// var newTank = new tankConstructor.newTank();
// newTank.set({x:10,y:20});
//

var nowjs = require('now')
	, sessions = require('./sessions')
	;

// next unique tank id
var nextTankID = 1000;

// generate a random int between 0 and max-1
var rand = function(max) {
	return Math.floor(Math.random() * max);
};

// THE tank constructor
var newTank = (function() {


	// prepare a data-package to be sent to all clients (include this tank if needed)
	// data = [ ]
	// forceSend = true means to send this tank even if nothing has changed
	var prepareToSend = function(data, forceSend) {
		if (this.changed || forceSend) {
			var obj = {	x:this.x, y:this.y, 
						facing:this.facing, 
						id:this.id };
			data.push(obj);
			this.changed = false;
		}
	};

	// initialize tank, based on a map (which has a width)
	// this will randomly place the tank somewhere on the world
	var initTank = function(map) {
		var worldWidth = map.mapData.width;				// width of the world
		this.worldWidth = worldWidth;					// save the width of the world
		this.x = rand(worldWidth);						// pick a random position
		this.y = rand(30) + 20;							// @TODO: set the Y value based on the dirt
		this.facing = Math.random() > 0.5 ? 1 : -1;		// random facing
		this.changed = true;							// need to send this tank's data to all clients
	};
	
	// tank constructor ... return the new tank object
	// sessID = sess.id == some unique key that identifies the user
	return function(sessID) {
		// DATA
		this.id = nextTankID++;			// unique id (how this tank is identified by the client)
		this.user = sessID;
		this.x = 0;						// position on the map of the MIDDLE/BOTTOM of the tank
		this.y = 0;
		this.facing = 1;				// direction facing (1 = right, -1 = left)
		this.changed = true;			// true means some data changed, and need to send this tank to clients
		
		// METHODS
		this.prepareToSend = prepareToSend;
		this.initTank = initTank;

		// update this tank given that some time has elapsed
		this.update = function(msElapsed) {
			this.x += msElapsed / 10;			// 100 pixels per second
			if (this.x > this.worldWidth) {
				this.x = 0;
			}
			this.changed = true;
		};

		return this;
	};
})();

exports.newTank = newTank;
