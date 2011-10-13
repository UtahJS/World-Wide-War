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
	
	// constructor
	return function(width) {
		mapData.width = width;
		this.mapData = mapData;
		this.buildMap = buildMap;
		return this;
	};
})();

exports.newMap = newMap;
