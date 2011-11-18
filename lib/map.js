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
		var ar = TerrainGenerator.gen_terrain(0, 240, mapData.width, 240, 9);
		var pd = TerrainGenerator.generate_per_pixel_data(mapData.width, ar);
		for(var x=0; x<mapData.width; x++) {
//			mapData.data[x] = Math.floor(Math.random() * 100 + 250);
			mapData.data[x] = pd[x];
		}


	};
	
	
var TerrainGenerator = {
  // Helper functions to make the code later more readable.
  randomInt: function(min, max){
    return Math.floor(Math.random()*(max-min)+1)+min;
  },

  //returns an array [min, max]
  min_max: function(num1, num2){
    return (num1 >= num2) ? [num1, num2] : [num2, num1];
  },

  // callback function for sorting an array of arrays, in this case we are sorting x values
  sort_x: function(p1, p2){
    return (p1[0] - p2[0]);
  },

  // the recursive part of the function
  _gen_terrain: function(x1, y1, x2, y2, depth, array){
    if(depth == 0) return depth;
    var range = Math.floor((depth*(depth*depth))/5);
    var midx = Math.floor(x1 + ((x2 - x1)/2));
    var mm = TerrainGenerator.min_max(y1, y2);
    var midy = TerrainGenerator.randomInt(mm[0]-range, mm[1]+range);
    array.push([midx, midy]);

    TerrainGenerator._gen_terrain(x1, y1, midx, midy, depth-1, array);
    TerrainGenerator._gen_terrain(midx, midy, x2, y2, depth-1, array);
    return depth;
  },

  // the recursive function shell
  // The function will return F(n) points where F(n) = 2 * F(n-1) - 1 where F(0) = 2
  // This doesn't allow us to specify an exact number of points to use. So we can just take the build as is
  // and generate the points for the areas where we dont have a y value.
  gen_terrain: function(x1, y1, x2, y2, depth){
    var points = [];
    points.push([x1, y1]);
    TerrainGenerator._gen_terrain(x1, y1, x2, y2, depth, points);
    points = points.sort(TerrainGenerator.sort_x);
    points.push([x2, y2]);
    return points;
  },

  // generates the data on a per pixel bases making it so you don't have gaps in between your 
  // columns of data.
  generate_per_pixel_data: function(width, orig_array){
    var pixel_data = [];

    // Generate the array of known values
    for(var i = 0; i < orig_array.length; i++){
      pixel_data[orig_array[i][0]] = orig_array[i][1];
    }

    // fill in the gaps of the missing values by grabing the slope of the surrounding
    // known values of any unknwn value.
    // Returns an array size of width with the y columns of each index/x value
    for(var i = 0; i < pixel_data.length; i++){
      if(pixel_data[i] == undefined){
        var prey = pixel_data[i-1];
        var j = 0;
        while(pixel_data[i+j] == undefined){
          ++j;
        }
        var posty = pixel_data[i+j];
        var dify = Math.floor((posty-prey)/2);
        for(j; j >= 0; j--){
          pixel_data[i+j] = (prey+dify);
        }
      }
    }
    return pixel_data;
  }, 

  // this is just a wrapper function for ease of use for right now.
  // pass in the starting points, the depth of our fractal generator and the width we want to generate points for.
  // note: we are missing edge cases so use a depth that will generate less points than the width for the best results.
  build_terrain: function(x1, y1, x2, y2, depth, width){
    var ar = TerrainGenerator.gen_terrain(x1, y1, x2, y2, depth);
    var pd = TerrainGenerator.generate_per_pixel_data(width, ar);
    return pd;
  }
};
	
	///////////////////////////////////////////////////////////////////////////////////
	
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
		mapData.height = 600;			// @TODO: get the height of the map from the client
		this.mapData = mapData;
		this.buildMap = buildMap;
		this.sendInitialData = sendInitialData;
		this.sendToClient = sendToClient;
		
		// update the map given that some time has elapsed
		this.updateMap = function(msElapsed) {
			var self = this;
			return;
			
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
