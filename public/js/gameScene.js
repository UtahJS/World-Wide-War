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

    scene.addChild(mapActor);
};


})();
