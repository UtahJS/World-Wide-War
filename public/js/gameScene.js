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

	// create a function the server can call to show something on browser console
	now.logToClientConsole = function(msg) {
		console.log("Message from Server: " + msg);
	};

	// create a function the server can call to define the entire map data
	now.defineMap = function(md) {
		console.log("Game.defineMap called.  with="+md.width);
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
		}
	};

    scene.addChild(mapActor);
};


})();
