(function() {

/**
 * Create The Main Game Scene (the scene where the game is played)
 * @param director {CAAT.Director}
 */
WAR.createGameScene = function(director) {
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

    scene.addChild(mapActor);
};


})();
