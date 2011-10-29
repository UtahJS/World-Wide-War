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

var nowjs = require('now');

var newMap = (function() {
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
	
	// send an update/change of the map to all client browsers
	var sendToClient = function(sess, arX, arV) {
		nowjs.getClient(sess.id, function () {
			var md = mapData;
			if (this.now) {
				if (this.now.defineMap) {
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
		this.sendToClient = sendToClient;
		return this;
	};
})();

exports.newMap = newMap;
