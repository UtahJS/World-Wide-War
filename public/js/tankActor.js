// TankActor -- a single tank on the world somewhere (ALL tanks, not just this user controlled tanks)

(function() {
 
/**
 * This Actor handles a single Tank
 *
 * @constructor
 * @extends CAAT.ActorContainer
 */
WAR.TankActor = function(x,y) {
    CAAT.ShapeActor.superclass.constructor.call(this);

	this.init(x,y);

    return this;
};

WAR.TankActor.prototype= {

	// data
	x: 30,				// position
	y: 30,
	user: 0,			// player that owns this tank
	width: 64,
	height: 64,
	selected: false,	// true means this is the currently selected tank for THIS user

	// initialize the tank object
	init: function(x,y) {
		this.x = x;
		this.y = y;
		this.setBounds(this.x,this.y,this.width,this.height);          // set tank initial position and size
		this.setFillStyle('rgb(200,200,255)');     // primary fill color for the tank
	},
	
	/**
	 * update the tank data
	 * @param {object} td
	 * @config .x
	 * @config .y
	 */
	updateTank: function(td) {
//		var worldHeight = 600;
//		this.x = td.x;// - this.width/2;;
//		this.y = td.y;//worldHeight - td.y;
	},
	
	moveTank: function(x,y) {
		var worldHeight = 600;
		this.x = x - this.width/2;
		this.y = worldHeight - y - this.height;
		this.setLocation(this.x, this.y);
	},

    /**
     * Draw the tank
     * Applies the values of fillStype, strokeStyle, compositeOp, etc.
     *
     * @param director a valid CAAT.Director instance.
     * @param time an integer with the Scene time (in ms) the Actor is being drawn.
     */
    paint : function(director,time) {
		
		// ** Perform elapsed time calculations ** ()
		var msElapsed = time - this.previousTime;				// total elapsed ms since previous frame
		this.previousTime = time;
		
		// ** Paint this actor **
        var ctx= director.crc;

		// just draw something for testing
        if ( null!==this.fillStyle ) {
            ctx.fillStyle= this.fillStyle;
            if (this.selected) {
            	ctx.fillStyle = 'rgb(255,255,100)';
            }
            ctx.beginPath();
            ctx.arc( this.width/2, this.height/2, Math.min(this.width,this.height)/2, 0, 2*Math.PI, false );
            ctx.fill();
        }

    }
};

extend( WAR.TankActor, CAAT.ActorContainer, null);
})();
