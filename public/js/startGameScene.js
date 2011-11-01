(function() {


// create an actor with a custom paint method. its behavior resembles that of
// a button.
    function createButton(director) {
        var actor= new CAAT.Actor().
                setSize( 60, 60 ).
                centerAt( director.width / 2, director.height / 2 );
 
        actor.paint= function( director, time ) {
 
            var ctx= director.ctx;
            ctx.save();
 
            ctx.fillStyle= this.pointed ? 'orange' : '#f3f';
            ctx.fillRect(0,0,this.width,this.height );
 
            ctx.strokeStyle= this.pointed ? 'red' : 'black';
            ctx.strokeRect(0,0,this.width,this.height );
 
            ctx.strokeStyle='white';
            ctx.beginPath();
            ctx.moveTo(5,10);
            ctx.lineTo(20,10);
            ctx.lineTo(15,5);
 
            ctx.moveTo(20,10);
            ctx.lineTo(15,15);
 
            ctx.lineWidth=2;
            ctx.lineJoin='round';
            ctx.lineCap='round';
            ctx.stroke();
            ctx.restore();
 
            ctx.font= '10px sans-serif';
            ctx.fillStyle='black';
            ctx.fillText(
                'Start Game',
                3,
                45);
 
 
        };
 
        return actor;
    }
    
	/**
	 * Create The Main Game Scene (the scene where the game is played)
	 * @param director {CAAT.Director}
	 */
	WAR.startGameScene = function(director) {
		// create the actual game scene object
	    var scene = director.createScene();
	
		now.moveToGameScene = function() {
			director.switchToNextScene(
			        2000,
			        false,
			        true
			);
		};

		now.moveToStartScene = function() {
			director.switchToPrevScene(
			        2000,
			        false,
			        true
			);
		};
		
		var button= createButton(director);
	    button.mouseClick= function(e) {
	    	now.startGame();	        
	    };
	    scene.addChild(button);
	
	};


})();
