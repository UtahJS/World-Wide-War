# World Wide War

##Kip - war.utahjs.com - post hook deploy


## CLIENT

###artwork

###paint world
###paint tank
###paint bullet
###paint mini-map

### user input: aim & fire & move
* accept input

### Debug Box Info
* How many people are connected
* Total tanks; bullets in world

### Basic CAAT framework with a scene for the game
* Show a loading page. Show a starting scene.  wait for user input. switch to "game scene"



## NODE

###build world

###tank

###bullet

###select next player

###game loop

###process user: aim, fire, move

###send data to clients

###user / player
* Determine how to get input from user (left/right arrow keys to move; up/down arrows to aim; space down to start shoot -- show power meter; space up to fire)
* pass events to server

## Game Play Thoughts
* People visit the main game URL and asks to play the game
* After everyone is ready, the game begins
* A long flat world is created
* User can scroll the world right/left
* User owns a collection (like 5) tanks
* User can select which tank has focus
* User can control the tank that has focus


## Code Layout, Design and Architecture 
* Everything starts in "views/index.jade"
  * If you need more files (like new .js files) includes, include them in via this file
* The actual client side starts up in "public/js/startup.js"
  * See the function near the bottom that does: window.addEventListener -- it creates the "Splash Screen"; and redirects to a function called "createScenes" (in same file)
* The main "Game" happens in "public/js/gameScene.js" -- this creates the Game Scene and everything that is part of the game
* The "Map" for the game is in "public/js/mapActor.js" -- this manages the game map
  * The game map is the ground, the earth, the dirt, the area the tanks roll on, the stuff that gets blown up and deformed by bombs
  * The "Map" is currently rendering "frames-per-second" in the top.left corner of the game scene


## by UtahJS Group

