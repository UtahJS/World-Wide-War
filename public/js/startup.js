
    (function() {

        var MS_SHOW_SPLASH_SCREEN = 2000,        // ms to keep the splash screen showing
            CANVAS_WIDTH   = 800,                // canvas size
            CANVAS_HEIGHT  = 600,
            zzz_last_var_with_semicolon;
		
		
		

        /**
         * This function will be called to let you define new scenes that will be
         * shown after the splash screen.
         * In this example, create a simple scene with some circles on it.
         * @param director {CAAT.Director}
         */
        function createScenes(director) {
        	WAR.startGameScene(director);
			WAR.createGameScene(director);
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
                            CANVAS_WIDTH, CANVAS_HEIGHT,

                        /* and will be added to the end of document. set an id of a canvas or div element */
                            undefined,

                        /* keep splash at least this 5000 milliseconds */
                            MS_SHOW_SPLASH_SCREEN,

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
