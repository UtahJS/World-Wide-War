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
	width: 50,
	height: 50,
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
		var worldHeight =  600;
		this.x = x - this.width/2;
		this.y = worldHeight - y - this.height;
		this.setLocation(this.x, this.y);
	},



      // Angle is between -80 to 80
     drawTank: function(ctx, posX, posY, angle) {
        
        ctx.save();
        ctx.translate(posX,posY);
        
        var scale = this.width / 100;
        var posX = posX;
        var posY = posY;
        var angle = angle;
        var cannonColor = "#000000";
        var tankColor = "#FF0000";
        var trackColor = "#000000";
        var wheelColor = "#FFFFFF";

        // Go to the starting position
        ctx.moveTo(posX, posY);

        ctx.scale(scale,scale);
        ctx.lineWidth = 3;

        // ========== CANNON ============ //

        ctx.beginPath();
        ctx.moveTo(50,50);
        ctx.lineTo(98,50);

        ctx.lineWidth = 11;
        ctx.strokeStyle = cannonColor;
        ctx.stroke();

        // ========== BUBBLE ============ //

        ctx.beginPath();
        ctx.arc(50,60,35,0,Math.PI,true); // Top bubble
        ctx.fillStyle = tankColor;
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        ctx.closePath();

        // ========== TRACKS ============ //

        ctx.beginPath();
        ctx.moveTo(3,80);
        ctx.quadraticCurveTo(3,62,20,62);
        ctx.lineTo(80,62);
        ctx.quadraticCurveTo(97,62,97,80);
        ctx.quadraticCurveTo(97,98,80,98);
        ctx.lineTo(20,98);
        ctx.quadraticCurveTo(3,98,3,80);
        ctx.fillStyle = trackColor;
        ctx.closePath();
        ctx.fill();

        // ========== WHEELS ============ //

        ctx.fillStyle = wheelColor;

        // Wheel 1
        ctx.beginPath();
        ctx.arc(23,80,11,0,Math.PI*2,false);
        ctx.fill();

        // Wheel 2
        ctx.beginPath();
        ctx.arc(50,80,11,0,Math.PI*2,false);
        ctx.fill();

        // Wheel 3
        ctx.beginPath();
        ctx.arc(77,80,11,0,Math.PI*2,false);
        ctx.fill();

        ctx.restore();
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
		this.drawTank(ctx, 0,0, 0);
/*        if ( null!==this.fillStyle ) {
            ctx.fillStyle= this.fillStyle;
            if (this.selected) {
            	ctx.fillStyle = 'rgb(255,255,100)';
            }
            ctx.beginPath();
            ctx.arc( this.width/2, this.height/2, Math.min(this.width,this.height)/2, 0, 2*Math.PI, false );
            ctx.fill();
        }
*/
    }
};

extend( WAR.TankActor, CAAT.ActorContainer, null);
})();
