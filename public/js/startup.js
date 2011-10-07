
    (function() {

        /**
         * This function will be called to let you define new scenes that will be
         * shown after the splash screen.
         * In this example, create a simple scene with some circles on it.
         * @param director {CAAT.Director}
         */
        function createScenes(director) {
            var scene = director.createScene();

            for (var i = 0; i < 30; i++) {
                var w = 30 + (100 * Math.random()) >> 0;
                var r = (255 * Math.random()) >> 0;
                var g = (255 * Math.random()) >> 0;
                var b = (255 * Math.random()) >> 0;
                scene.addChild(
                        new CAAT.ShapeActor().
                                setShape(CAAT.ShapeActor.prototype.SHAPE_CIRCLE).
                                setBounds(
                                (director.width * Math.random()) >> 0,
                                (director.height * Math.random()) >> 0,
                                w,
                                w).
                                setFillStyle('rgb(' + r + ',' + g + ',' + b + ')')
                        );
            }
        };


        /**
         * Startup it all up when the document is ready.
         * Change for your favorite frameworks initialization code.
         */
        window.addEventListener(
                'load',
                function() {
                    CAAT.modules.splash.ShowDefaultSplash(
                        /* canvas will be 800x600 pixels */
                            700, 500,

                        /* and will be added to the end of document. set an id of a canvas or div element */
                            undefined,

                        /* keep splash at least this 5000 milliseconds */
                            5000,

                        /*
                         load these images and set them up for non splash scenes.
                         image elements must be of the form:
                         {id:'<unique string id>',    url:'<url to image>'}

                         No images can be set too.
                         */
                            [
                            ],

                         /*
                            onEndSplash callback function.
                            Create your scenes on this method.
                          */
                         createScenes
                            );
                },
                false);
    })();
