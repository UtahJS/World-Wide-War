(function() {

/**
 * Create The Main Game Scene (the scene where the game is played)
 * @param director {CAAT.Director}
 */
WAR.createGameScene = function(director) {
	// create the actual game scene object
    var scene = director.createScene();

    // fill the scene with game content
    for (var i = 0; i < 30; i++) {
        var w = 30 + (100 * Math.random()) >> 0;
        var r = (255 * Math.random()) >> 0;
        var g = (255 * Math.random()) >> 0;
        var b = (255 * Math.random()) >> 0;
        scene.addChild(
                new CAAT.ShapeActor().
                        setShape(CAAT.ShapeActor.prototype.SHAPE_CIRCLE).
                        setBounds(
                        (director.width * Math.random()) >> 0,		// random position
                        (director.height * Math.random()) >> 0,
                        w,
                        w).
                        setFillStyle('rgb(' + r + ',' + g + ',' + b + ')')
                );
    }
};


})();
