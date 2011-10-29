(function() {

/**
 * Create The Main Game Scene (the scene where the game is played)
 * @param director {CAAT.Director}
 */
WAR.createGameScene = function(director) {

	var tankData = {};			// tank-id === the key

	// create the actual game scene object
    var scene = director.createScene();

    // fill the scene with game content
    var mapActor = new WAR.MapActor(director.width,director.height);		// create THE map

	// create a function the server can call to define the entire map data
	now.defineMap = function(md) {
		if (md && md.width) {
			now.gotMap = true;
		}
		mapActor.defineMap(md);
	};

	// create a function the server can call to alter the map data
	now.updateMap = function(x,v) {
		mapActor.updateMap(x,v);
		// if (now && now.mapData && now.mapData.data) {
		// 	var map = now.mapData.data;
		// 	map[x] = v;
		// }
	};
	
	// create a function the server can call to SET the entire collection of tanks
	now.setInitialTanks = function(td) {
		if (td) {
			for(var i=0; i<td.length; i++) {
				var d = td[i];
				if (!tankData[d.id]) {
					// NEW TANK
					tankData[d.id] = d;
					d.actor = new WAR.TankActor(d.x,d.y);
					scene.addChild(d.actor);
				}
			}
			var cnt = 0;
			for(var key in tankData) {
				if (tankData.hasOwnProperty(key)) {
					cnt++;
				}
			}
			console.log("Now have " + cnt + " tanks");
		}
	};

    scene.addChild(mapActor);
};


})();
