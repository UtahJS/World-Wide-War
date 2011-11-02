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
		//console.log("Key pressed: keycode="+keycode);
		// "N" or "n" == "Select Next Tank"
		if (keycode == 110 || keycode == 78) {
			selectNextTank();
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
			now.gotMap = true;
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
					d.actor = new WAR.TankActor(d.x,d.y);
					scene.addChild(d.actor);
				}
			}
		}
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
					tank.x = d.x;
					tank.y = d.y;
					var actor = tank.actor;				// CAAT actor for this tank
					actor.setLocation(d.x, d.y);
				} else {
					// NEW TANK
					tankData[d.id] = d;
					d.actor = new WAR.TankActor(d.x,d.y);
					scene.addChild(d.actor);
				}
			}
		}
	};
	

};


})();
