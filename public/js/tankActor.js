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

    return this;
};

WAR.TankActor.prototype= {

	// data
	x: 30,				// position
	y: 30,
	powerMax: 0,		// maximum power tank can reach
	power: 0,			// current power tank has available
	user: 0,			// player that owns this tank
	width: 50,
	height: 50,
	marginBottom: 10,	// extra margin below tank
	selected: false,	// true means this is the currently selected tank for THIS user
	tankShift: 0,		// amount the entire world has been shifted
	mapWidth: 0,		// world map width

	// initialize the tank object
	init: function(td) {
		this.x = td.x;
		this.y = td.y;
		this.powerMax = td.powerMax;
		this.power = td.power;
		this.setBounds(this.x,this.y,this.width,this.height+this.marginBottom);          // set tank initial position and size
		this.setFillStyle('rgb(200,200,255)');     // primary fill color for the tank
	},
	
	/**
	 * update the tank data
	 * @param {object} td
	 * @config .x
	 * @config .y
	 */
	updateTank: function(d) {
		var worldHeight =  600;
		this.x = d.x - this.width/2;
		this.y = worldHeight - d.y - this.height + this.marginBottom;
		var tx = this.x + this.tankShift;
		if (tx > this.mapWidth) tx -= this.mapWidth;
		if (tx < -this.width) tx += this.mapWidth;
		if (d.powerMax) this.powerMax = d.powerMax;
		if (d.power !== undefined) this.power = d.power;
		this.setLocation(tx, this.y);
	},
	
	/**
	 * process ms milliseconds elapsed
	 */
	elapseTime: function(msElapsed) {
		// NOTE: This is a client-side estimate of the real server value
		this.power += 10 * msElapsed / 1000;		// 10 power per second
		if (this.power > this.powerMax) {
			this.power = this.powerMax;
		}
	},



      // Angle is between -80 to 80
     drawTank: function(ctx, posX, posY, angle) {
        
        ctx.save();
        var scale = this.width / 100;
        ctx.translate(posX,posY);
        ctx.scale(scale,scale);
        
        var posX = posX;
        var posY = posY;
        var angle = angle;
        var cannonColor = "#000000";
        var tankColor = "#FF0000";
        var trackColor = "#000000";
        var wheelColor = "#FFFFFF";

        // Go to the starting position
        ctx.moveTo(posX, posY);

        ctx.lineWidth = 3;

        // ========== CANNON ============ //
		ctx.save();
		ctx.translate(50,50);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(48,0);

        ctx.lineWidth = 11;
        ctx.strokeStyle = cannonColor;
        ctx.stroke();
		ctx.restore();
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

        // ========== POWER GAUGE ============ //
        var yy = 110;
        ctx.strokeStyle = "#8080ff";
        ctx.lineWidth = 10;
        ctx.beginPath();
		ctx.moveTo(0, yy);
		var p = this.power / this.powerMax;		// percentage of power left
		ctx.lineTo(100*p, yy);
		ctx.stroke();

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
    },
    
    setShift: function(n) {
    	this.tankShift = n;
    }
};

extend( WAR.TankActor, CAAT.ActorContainer, null);
})();
