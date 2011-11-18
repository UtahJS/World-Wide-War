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
		this.worldMap = map;							// save the entire world map
		this.x = rand(worldWidth);						// pick a random position
		this.y = rand(80) + 40;							// @TODO: set the Y value based on the dirt
		this.xWanted = this.x;
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
		this.xWanted = 0;				// position of the map this tank WANTS to reach
		this.facing = 1;				// direction facing (1 = right, -1 = left)
		this.changed = true;			// true means some data changed, and need to send this tank to clients
		
		// METHODS
		this.prepareToSend = prepareToSend;
		this.initTank = initTank;

		// update this tank given that some time has elapsed
		this.update = function(msElapsed) {
			// Move tank Up/Down to match the current ground level
			var xx = Math.floor(this.x);
			var h = this.y;
			
			if (xx >= 0 && xx < this.worldMap.mapData.width) {
				h = this.worldMap.mapData.data[xx];
				// h = this.worldMap.mapData.height - h;
			}
			if (this.y != h) {
/*				var distance = Math.abs(this.y - h);
				var dir = this.y > h ? -1 : 1;
				var newy = this.y + dir * distance * msElapsed * 100 / 1000;
				if (dir > 0) {
					if (newy > h) newy = h;
				} else {
					if (newy < h) newy = h;
				}
				this.y = newy; */
				this.y = h;
				this.changed = true;
			}
			
			// Try to move the tank to where the user wanted it to go
			if (this.x != this.xWanted) {
				var distance = Math.abs(this.x - this.xWanted);
				var dir = this.x - this.xWanted;
				if (distance > this.worldWidth / 2) {
					distance = Math.abs(this.xWanted - this.x);
					dir = this.xWanted - this.x;
				}
				dir = (dir < 0? 1 : -1);

				// calculate distance to move
				var nPixelsPerSecond = 100;
				var dx = msElapsed * nPixelsPerSecond / 1000;	// N pixels per second
				var xMove = dx * dir;
				// move tank
				if (Math.abs(xMove) > distance) {
					this.x = this.xWanted;
				} else {
					this.x += xMove;
				}
				// wrap tank to other side of world, if needed
				if (this.x > this.worldWidth) {
					this.x -= this.worldWidth;
				} else if (this.x < 0) {
					this.x += this.worldWidth;
				}
				// mark this tank as "changed.  need to send it to clients"
				this.changed = true;
			}
		};

		this.setxWanted = function(newx) {
			while (newx < 0) newx += this.worldWidth;
			while (newx >= this.worldWidth) newx -= this.worldWidth;
			this.xWanted = newx;
		};

		return this;
	};
})();

exports.newTank = newTank;
