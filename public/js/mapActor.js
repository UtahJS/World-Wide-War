// MapActor

(function() {
 
/**
 * This Actor draws the WAR Map
 *
 * @constructor
 * @extends CAAT.ActorContainer
 */
WAR.MapActor = function(wide,high) {
    CAAT.ShapeActor.superclass.constructor.call(this);

	this.init(wide,high);

    return this;
};

WAR.MapActor.prototype= {

		map: [],				// array of map "line" heights
		
		// frames-per-second variables
		fpsLast: 0,				// frames-per-second last second
		fpsTimestamp: 0,		// timestamp for counting frame painted this second
		fpsCount: 0,			// total frames painted this second
		

	// initialize the map shape object
	init: function(w,h) {
		if (w) this.width = w;
		if (h) this.height = h;
		
		this.setBounds(0,0,this.width,this.height);       // allow the make to fill the entire scene area (it will mostly fill the bottom)
		this.setFillStyle('rgb(200,200,200)');            // primary fill color is the dirt
		
		for(var x=0; x<this.width; x++) {
			this.map[x] = Math.random() * 100 - 50 + this.height/2;
		}
	},

    /**
     * Draw the map
     * Applies the values of fillStype, strokeStyle, compositeOp, etc.
     *
     * @param director a valid CAAT.Director instance.
     * @param time an integer with the Scene time the Actor is being drawn.
     */
    paint : function(director,time) {
		// fps calculation
		var now = new Date();
		if (!this.fpsTimestamp) this.fpsTimestamp = now;
		if (now - this.fpsTimestamp >= 1000) {
			this.fpsLast = this.fpsCount;
			this.fpsCount = 0;
			this.fpsTimestamp = now;
		}
		this.fpsCount++;
		
        var ctx= director.crc;

        if ( null!==this.fillStyle ) {
            ctx.fillStyle= this.fillStyle;
            ctx.beginPath();
            ctx.arc( this.width/2, this.height/2, Math.min(this.width,this.height)/2, 0, 2*Math.PI, false );
            ctx.fill();
        }
        ctx.beginPath();
		ctx.moveTo(0,this.height);
        for(var x=0; x<this.width; x++) {
			ctx.lineTo(x,this.map[x]);
        }
		ctx.lineTo(this.width, this.height);
        ctx.fillStyle= 'rgb(100,120,100)';
		ctx.fill();
		
		ctx.fillText("FPS: "+this.fpsLast, 10,50);
    }
};

extend( WAR.MapActor, CAAT.ActorContainer, null);
})();
