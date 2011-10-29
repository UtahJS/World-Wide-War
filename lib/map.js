// Map handler
// The "Map" is the ground/dirt/terrain
// The dirt is the stuff that the tanks roll on
// The dirt is the stuff that bombs destroy
// The dirt is defined as pixel-wide tall "lines" of dirt.  Each line can be shortened.
//
// USAGE:
// var mapConstructor = require('map');
// var myMap = new mapConstructor.newMap(1000);
//

var nowjs = require('now')
	, sessions = require('./sessions')
	;

var newMap = (function() {
	// @TODO: put this in "this", so we have map data per map (not a global)
	// define the map data
	var mapData = {
		data: [],				// array of map data.  each element = how tall the dirt is at that X map location
		width: 1000
	};

	// define the "Build-A-Map" function
	var buildMap = function() {
		for(var x=0; x<mapData.width; x++) {
			mapData.data[x] = Math.floor(Math.random() * 100 + 250);
		}
	};
	
	
	// send the initial map data to a client browser
	var sendInitialData = function(sess) {
		nowjs.getClient(sess.id, function () {
			this.now.defineMap(mapData);
		});
	};
	
	// send an update/change of the map to all client browsers
	var sendToClient = function(sess, arX, arV) {
		nowjs.getClient(sess.id, function () {
			var md = mapData;
			if (this.now) {
				if (false && this.now.defineMap) {
					// Note: FireFox takes a rather LONG time to send the map data, and sometimes it doesn't get there
					// Note: continue sending the entire map to the client, until the client replies: "gotMap"
					if (!this.now.mapSent) this.now.mapSent = 0;
					this.now.mapSent++;
					if (this.now.mapSent < 10 || !this.now.gotMap) {
						console.log("MAP: calling defineMap for "+sess.id+".   mapSent="+this.now.mapSent+".   md.width="+md.width);
						this.now.defineMap(md);
					}
				}
				if (this.now.updateMap) {
					this.now.updateMap(arX, arV);
				}
			}
		});
	};
	
	
	// bew map constructor
	return function(width) {
		mapData.width = width;
		this.mapData = mapData;
		this.buildMap = buildMap;
		this.sendInitialData = sendInitialData;
		this.sendToClient = sendToClient;
		
		// update the map given that some time has elapsed
		this.updateMap = function(msElapsed) {
			var self = this;
			
			
			// ***********************************************************************		
			// @TODO: remove this temp debug test code that is monkeying with the map			
			var md = mapData;
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
					console.log("SIGNAL GAME OVER");
					break;
				}
				arX.push(x);
				arV.push(md.data[x]);
				x++;
			}
			// send map changes to all clients/browser/actors
			sessions.runOnAllSessions(function(sess) {
				// Note: 'this" == "now client"
				self.sendToClient(sess,arX, arV);
			});
			// ***********************************************************************		

		};
		
		return this;
	};
})();

exports.newMap = newMap;
