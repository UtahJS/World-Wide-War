

// define the public map data
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

exports.mapData = mapData;
exports.buildMap = buildMap;

