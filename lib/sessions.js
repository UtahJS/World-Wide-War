
// Collection of all Sessions

var sessions = [];					// collection of "Now" clients
var numSessions = 0;				// total sessions currently connected


// easy access to sesions via Now User Data
var createSessionViaNow = function(nowUser) {
	return createSession(nowUser.clientId);
};
var findSessionViaNow = function(nowUser) {
	return findSession(nowUser.clientId);
};
var deleteSessionViaNow = function(nowUser) {
	return deleteSession(nowUser.clientId);
};


// create a new session via an ID
var createSession = function(id) {
	if (!sessions[id]) {
		sessions[id] = {};
		numSessions++;
	}
	return sessions[id];
};

// find an existing session via an ID
var findSession = function(id) {
	return sessions[id];
};

// delete an existing session via an ID
var deleteSession = function(id) {
	if (sessions[id]) {
		delete sessions[id];
		numSessions--;
		return true;
	}
	return false;
};


exports.createSessionViewNow = createSessionViaNow;
exports.findSessionViaNow = findSessionViaNow;
exports.deleteSessionViaNow = deleteSessionViaNow;
exports.createSession = createSession;
exports.findSession = findSession;
exports.deleteSession = deleteSession;


/*

// ** Track all client-browser connections (stored in "actors")
var actors = [];					// actors = collection of "Now" clients
var numActors = 0;
nowjs.on('connect', function() {
	actors[this.user.clientId] = {x: 0, y: 0};
	numActors++;
	console.log("Client just connected.  Total connected="+actors.length+" == " + numActors);
	console.dir(this.user);
	startNewGame();
});
nowjs.on('disconnect', function() {
  for(var i in actors) {
    if(i == this.user.clientId) {
      delete actors[i];
      break;
    }
  }
	numActors--;
	console.log("Client just DISCONNECTED.  Total connected="+actors.length+" == " + numActors);
});

*/