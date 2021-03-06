(function() {

/**
 * Create The Main Game Scene (the scene where the game is played)
 * @param director {CAAT.Director}
 */
WAR.createGameScene = function(director) {

	var tankData = {};			// tank-id === the key  ---> {actor:{TankActor}}
	var idSelected;				// id of the current selected tank

	// create the actual game scene object
    var scene = director.createScene();

    // fill the scene with game content
    var mapActor = new WAR.MapActor(director.width,director.height);		// create THE map
    scene.addChild(mapActor);


	// get the ID of the current selected tank (tankData[id] = TankActor for selected tank)	
	var getSelectedTankID = function () {
		var td;
		for(var id in tankData) {
			if (tankData.hasOwnProperty(id)) {
				if (idSelected == id) {
					// found the selected tank
					return idSelected;
				}
			}
		}
		for(var id in tankData) {
			if (tankData.hasOwnProperty(id)) {
				setSelectedTankID(id);
				return idSelected;
			}
		}
		setSelectedTankID(undefined);
		return idSelected;
	};
	// set a tank to be the currently selected tank
	var setSelectedTankID = function(id) {
		// de-select previous tank
		if (idSelected && tankData[idSelected] && tankData[idSelected].actor) {
			tankData[idSelected].actor.selected = false;
		}
		if (id && tankData[id] && tankData[id].actor) {
			idSelected = id;
			tankData[idSelected].actor.selected = true;
		} else {
			idSelected = undefined;
		}
	};
	// select the next tank
	var selectNextTank = function() {
		var idt = getSelectedTankID();		// id of current selected tank
		var found = false;					// true means "found the current selected tank"
		var nextSet = false;				// true means "set the selected tank to the next tank"
		if (idt) {
			for(var id in tankData) {
				if (tankData.hasOwnProperty(id)) {
					if (found) {
						setSelectedTankID(id);
						nextSet = true;
						break;
					}
					if (id === idt) {
						found = true;
					}
				}
			}
		}
		if (!nextSet) {
			// at end of tank list ... start over
			setSelectedTankID(undefined);			// select NO tank
			getSelectedTankID();					// pick the first available tank (or none)
		}
	};
	
	// remove all tanks from the game
	var removeAllTanks = function() {
		for(var id in tankData) {
			if (tankData.hasOwnProperty(id)) {
				var d = tankData[id];
				scene.removeChild(d.actor);
				tankData[id] = undefined;
			}
		}
		tankData = [];
	};

	// scroll the entire world right/left N pixels (- = left, + = right)
	var scrollScreen = function(n) {
		var mapShift = mapActor.shift(n);
		for(var id in tankData) {
			if (tankData.hasOwnProperty(id)) {
				var d = tankData[id];
				d.actor.setShift(-mapShift);
			}
		}
	};
	
	var updateAllTanks = function() {
		if (mapActor && mapActor.mapData) {
			var mapWidth = mapActor.mapData.width;
			for(var id in tankData) {
				if (tankData.hasOwnProperty(id)) {
					var d = tankData[id];
					d.actor.mapWidth = mapWidth;
				}
			}
		}
	};

	// - - - - - - - - - - - - - - - - - - - - - - -
	// FUNCTIONS TO HANDLE THE MAIN CLIENT GAME LOOP
	
	// THE main game loop
	// msElapsed = total ms elapsed since previous game loop
	var gameLoop = function(msElapsed) {
		//console.log("Game timer: "+msElapsed);
		// elapse time for every tank (increase power ...)
		for(var id in tankData) {
			if (tankData.hasOwnProperty(id)) {
				var d = tankData[id];
				d.actor.elapseTime(msElapsed);
			}
		}		
	};
	// create THE game timer
	var lastTimerValue = 0;
	scene.createTimer(
		0,
		Number.MAX_VALUE,
		function(scene_time, timer_time, timertask_instance)  {   // timeout
		},
		function(scene_time, timer_time, timertask_instance)  {   // tick
			gameLoop(timer_time-lastTimerValue);
			lastTimerValue = timer_time;
		},
		function(scene_time, timer_time, timertask_instance)  {   // cancel
		}
	);
 

	// - - - - - - - - - - - - - - - - - - -
	// FUNCTIONS TO HANDLE USER INPUT EVENTS	
	
	// @TODO: watch for user events (mouse clicks, keyboard events ...)
	document.onkeypress = function(e) {
		var keycode = null;
        if(window.event) {
            keycode = window.event.keyCode;
        }else if(e) {
            keycode = e.which;
        }
		// console.log("Key pressed: keycode="+keycode);
		
		var idt = getSelectedTankID();		// id of current selected tank
		var td = tankData[idt];				// tank data

		if (keycode == 110 || keycode == 78) {
			// "N" or "n" == "Select Next Tank"
			selectNextTank();

		} else if (keycode == 97 || keycode == 65) {
			// "A" or "a" == "Move selected tank LEFT 3 Pixels"
			if (td) {
				var newx = td.x - (keycode == 97? 3 : 15);
				now.queueAction(idt, {action:"move", x:newx});
			}
			
		} else if (keycode == 100 || keycode == 68) {
			// "D" or "d" == "Move selected tank RIGHT 3 Pixels
			if (td) {
				var newx = td.x + (keycode == 100? 3 : 15);
				now.queueAction(idt, {action:"move", x:newx});
			}
			
		} else if (keycode == 91) {
			// "[" == "Shift screen left"
			scrollScreen(-10);
			
		} else if (keycode == 93) {
			// "]" == "Shift screen right"
			scrollScreen(10);			
		}
	};



	// - - - - - - - - - - - - - - - - - - - - - -
	// FUNCTIONS TO ALLOW SERVER TO TALK TO CLIENT

	// create a function the server can call to show something on browser console
	now.logToClientConsole = function(msg) {
		console.log("Message from Server: " + msg);
	};

	// create a function the server can call to reset the game data (delete all tanks and bullets)
	now.resetGame = function() {
		mapActor.resetGame();
		removeAllTanks();
	};

	// create a function the server can call to define the entire map data
	now.defineMap = function(md) {
		if (md && md.width) {
			now.gotMap = true;			// kludge: signal back to the server that I got the map data
			updateAllTanks();
		}
		mapActor.defineMap(md);
	};

	// create a function the server can call to alter the map data
	now.updateMap = function(x,v) {
		mapActor.updateMap(x,v);
	};
	
	// create a function the server can call to SET the entire collection of tanks
	now.setInitialTanks = function(td) {
		if (td) {
			for(var i=0; i<td.length; i++) {
				var d = td[i];
				if (!tankData[d.id]) {
					// NEW TANK
					tankData[d.id] = d;
					d.actor = new WAR.TankActor();
					d.actor.init(d);
					scene.addChild(d.actor);
				}
			}
		}
		updateAllTanks();
	};
	
	// create a function the server can call to update tanks info (position, facing ...)
	// @param {array} td = array of tank data
	now.updateTanks = function(td) {
		if (td) {
			for(var i=0; i<td.length; i++) {
				var d = td[i];
				if (tankData[d.id]) {
					// KNOWN TANK
					var tank = tankData[d.id];			// passed in tank data
					tank.actor.updateTank(d);
					tank.x = d.x;
					tank.y = d.y;
//					var actor = tank.actor;				// CAAT actor for this tank
//					actor.setLocation(d.x, d.y);
				} else {
					// NEW TANK
					tankData[d.id] = d;
					d.actor = new WAR.TankActor();
					d.actor.init(d);
					scene.addChild(d.actor);
				}
			}
		}
	};
	

};


})();
