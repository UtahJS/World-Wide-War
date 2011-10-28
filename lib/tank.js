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
//	, sessions = require('./lib/sessions')
	;

// next unique tank id
var nextTankID = 1000;

// generate a random int between 0 and max-1
var rand = function(max) {
	return Math.floor(Math.random() * max);
};

// THE tank constructor
var newTank = (function() {

	// spend "ms milliseconds" trying to move to the map-location "x" (horizontal location)
	var moveToPoint = function(ms,x) {
		// @TODO: write this function
	};

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

	var initTank = function(map) {
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
		this.moveToPoint = moveToPoint;
		this.prepareToSend = prepareToSend;

		return this;
	};
})();

exports.newTank = newTank;
