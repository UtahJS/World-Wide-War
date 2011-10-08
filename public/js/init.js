// THE first JavaScript loaded

// Create the "WAR" Global namespace object
WAR = {};



(function() {
 
     /**
      * This Actor draws common shapes, concretely Circles and rectangles.
      *
      * @constructor
      * @extends CAAT.ActorContainer
      */
     CAAT.ShapeActor = function() {
         CAAT.ShapeActor.superclass.constructor.call(this);
         this.compositeOp= 'source-over';
 
         /**
        * Thanks Svend Dutz and Thomas Karolski for noticing this call was not performed by default,
          * so if no explicit call to setShape was made, nothing would be drawn.
          */
         this.setShape( this.SHAPE_CIRCLE );
         return this;
     };
 
     CAAT.ShapeActor.prototype= {
 
         shape:          0,      // shape type. One of the constant SHAPE_* values
       compositeOp:    null,   // a valid canvas rendering context string describing compositeOps.
 
        SHAPE_CIRCLE:   0,      // Constants to describe different shapes.
         SHAPE_RECTANGLE:1,
 
         /**
          * Sets shape type.
          * No check for parameter validity is performed.
          * Set paint method according to the shape.
          * @param iShape an integer with any of the SHAPE_* constants.
          * @return this
          */
       setShape : function(iShape) {
             this.shape= iShape;
             this.paint= this.shape===this.SHAPE_CIRCLE ?
                     this.paintCircle :
                     this.paintRectangle;
            return this;
         },
         /**
          * Sets the composite operation to apply on shape drawing.
          * @param compositeOp an string with a valid canvas rendering context string describing compositeOps.
          * @return this
         */
         setCompositeOp : function(compositeOp){
             this.compositeOp= compositeOp;
             return this;
         },
         /**
          * Draws the shape.
          * Applies the values of fillStype, strokeStyle, compositeOp, etc.
         *
         * @param director a valid CAAT.Director instance.
         * @param time an integer with the Scene time the Actor is being drawn.
          */
         paint : function(director,time) {
         },
         /**
          * @private
          * Draws a circle.
          * @param director a valid CAAT.Director instance.
         * @param time an integer with the Scene time the Actor is being drawn.
         */
         paintCircle : function(director,time) {
             var ctx= director.crc;
 
            ctx.globalCompositeOperation= this.compositeOp;
             if ( null!==this.fillStyle ) {
                 ctx.fillStyle= this.fillStyle;
                 ctx.beginPath();
                 ctx.arc( this.width/2, this.height/2, Math.min(this.width,this.height)/2, 0, 2*Math.PI, false );
                 ctx.fill();
             }
 
             if ( null!==this.strokeStyle ) {
                 ctx.strokeStyle= this.strokeStyle;
                 ctx.beginPath();
                ctx.arc( this.width/2, this.height/2, Math.min(this.width,this.height)/2, 0, 2*Math.PI, false );
                ctx.stroke();
             }
         },
         /**
          *
          * Private
          * Draws a Rectangle.
          *
          * @param director a valid CAAT.Director instance.
          * @param time an integer with the Scene time the Actor is being drawn.
          */
        paintRectangle : function(director,time) {
             var ctx= director.crc;
 
             ctx.globalCompositeOperation= this.compositeOp;
             if ( null!==this.fillStyle ) {
                 ctx.fillStyle= this.fillStyle;
                 ctx.beginPath();
                 ctx.fillRect(0,0,this.width,this.height);
                 ctx.fill();
             }
 
             if ( null!==this.strokeStyle ) {
                 ctx.strokeStyle= this.strokeStyle;
                 ctx.beginPath();
                 ctx.strokeRect(0,0,this.width,this.height);
                 ctx.stroke();
             }
         }
     };
 
     extend( CAAT.ShapeActor, CAAT.ActorContainer, null);
 })();



