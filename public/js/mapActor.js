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

		
		// frames-per-second variables
		fpsLast: 0,				// frames-per-second last second
		fpsTimestamp: 0,		// timestamp for counting frame painted this second
		fpsCount: 0,			// total frames painted this second
		previousTime: 0,		// time sent to "paint" on previous frame (used to calculate elapsed time)
		

	// initialize the map shape object
	init: function(w,h) {
		if (w) this.width = w;
		if (h) this.height = h;
		
		this.setBounds(0,0,this.width,this.height);       // allow the make to fill the entire scene area (it will mostly fill the bottom)
		this.setFillStyle('rgb(200,200,200)');            // primary fill color is the dirt
		
	},

    /**
     * Draw the map
     * Applies the values of fillStype, strokeStyle, compositeOp, etc.
     *
     * @param director a valid CAAT.Director instance.
     * @param time an integer with the Scene time (in ms) the Actor is being drawn.
     */
    paint : function(director,time) {
		// ** fps calculation **
		var nowms = new Date();
		if (!this.fpsTimestamp) this.fpsTimestamp = nowms;
		if (nowms - this.fpsTimestamp >= 1000) {
			this.fpsLast = this.fpsCount;
			this.fpsCount = 0;
			this.fpsTimestamp = nowms;
		}
		this.fpsCount++;
		
		// ** Perform elapsed time calculations ** ()
		var msElapsed = time - this.previousTime;				// total elapsed ms since previous frame
		this.previousTime = time;
		
		// ** Paint this actor **
        var ctx= director.crc;

		// paint some cute background goo
        if ( null!==this.fillStyle ) {
            ctx.fillStyle= this.fillStyle;
            ctx.beginPath();
            ctx.arc( this.width/2, this.height/2, Math.min(this.width,this.height)/2, 0, 2*Math.PI, false );
            ctx.fill();
        }

		// paint the map (NOTE: Map data is sent to this client from the server)
		if (now && now.mapData && now.mapData.data) {
			var map = now.mapData.data;
	        ctx.beginPath();
			ctx.moveTo(0,this.height);
	        for(var x=0; x<this.width; x++) {
				ctx.lineTo(x,this.height-map[x]);
	        }
			ctx.lineTo(this.width, this.height);
	        ctx.fillStyle= 'rgb(100,120,100)';
			ctx.fill();
		}
		
		// paint debug frames-per-second
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillText("FPS: "+this.fpsLast+".   ms elapsed="+msElapsed, 4,this.height-6);
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillText("FPS: "+this.fpsLast+".   ms elapsed="+msElapsed, 5,this.height-5);
    }
};

extend( WAR.MapActor, CAAT.ActorContainer, null);
})();
