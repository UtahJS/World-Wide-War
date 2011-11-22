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

		// Map Data
		mapData: null,			// see map.js   ...   {data:[ ],  width:1000}
		mapShift: 0,			// N pixels map is shifted (+10 means 10 pixels to the right)
		
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
	
	// reset the map (game over)
	resetGame: function() {
		this.mapData = null;
	},
	
	/**
	 * define/set the entire map data object (see map.js on server)
	 */
	defineMap: function(md) {
		this.mapData = md;
	},
	/**
	 * update a single column of map data
	 * @param x = index into map data of column to change   (or array)
	 * @param v = new value for that column  (or array)
	 */
	updateMap: function(x, v) {
		if (this.mapData && this.mapData.data) {
			if (typeof (x) == 'number') {
				this.updateMap1(x,v);
			} else if (x.length && v.length) {
				for(var i=0; i<x.length; i++) {
					this.updateMap1(x[i],v[i]);
				}
			}
		}
	},
	updateMap1: function(x, v) {
		if (this.mapData.width > x) {
			var map = this.mapData.data;
			map[x] = v;
		}		
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
        ctx.save();
        ctx.translate(0,0);

		// paint some cute background goo
        if ( null!==this.fillStyle ) {
        	for(var qqq=0; qqq<2; qqq++) {
				ctx.save();
				var tx = -this.mapShift;
				if (this.mapData && this.mapData.width) {
					tx += qqq * this.mapData.width;
					if (this.mapData.width > this.width * 2) {
						tx = tx / 2;							// make this paralax scrolling (IF map is wide enough)
					}
				}
				ctx.translate(tx,0);
				ctx.fillStyle= this.fillStyle;
				ctx.beginPath();
				ctx.arc( this.width/2, this.height/2, Math.min(this.width,this.height)/2, 0, 2*Math.PI, false );
				ctx.fill();
				ctx.restore();
			}
        }

		// paint the map (NOTE: Map data is sent to this client from the server)
		if (this.mapData && this.mapData.data) {
			var map = this.mapData.data;
			var xScrn = 0;						// Screen X to paint next
			var xMap = this.mapShift;			// Map X to paint at xScrn next
	        ctx.beginPath();
			ctx.moveTo(xScrn,this.height);
			var nStop = this.width < this.mapData.width ? this.width : this.mapData.width;
	        while(xScrn<this.width) {
				ctx.lineTo(xScrn,this.height-map[xMap]);
				xScrn += 1;
				xMap += 1;
				if (xMap >= this.mapData.width) {
					xMap -= this.mapData.width;
				}
	        }
			ctx.lineTo(this.width, this.height);
	        ctx.fillStyle= 'rgb(100,120,100)';
			ctx.fill();
		}
		
		ctx.restore();
		// paint debug frames-per-second
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillText("FPS: "+this.fpsLast+".   ms elapsed="+msElapsed, 4,this.height-6);
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillText("FPS: "+this.fpsLast+".   ms elapsed="+msElapsed, 5,this.height-5);
    },
    
    // shift the map right/left N pixels
    shift: function(n) {
    	n = -n;
    	if (this.mapData && this.mapData.width) {
	    	this.mapShift += n;
	    	if (this.mapShift >= this.mapData.width) {
	    		this.mapShift -= this.mapData.width;
	    	} else if (this.mapShift < 0) {
	    		this.mapShift += this.mapData.width;
	    	}
	    }
	    return this.mapShift;
    }

};

extend( WAR.MapActor, CAAT.ActorContainer, null);
})();
