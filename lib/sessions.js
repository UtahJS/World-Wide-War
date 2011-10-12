// Collection of all Sessions
// session = {id:...}


var sessions = [];					// collection of client-browser "sessions"
var numSessions = 0;				// total sessions currently connected


// easy access to sesions via Now User Data: nowUser.clientId
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
		sessions[id] = {id:id};
		numSessions++;
		console.log("session created for "+id+".  count="+numSessions);
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
		console.log("session deleted for "+id+".  count="+numSessions);
		return true;
	}
	return false;
};

// return the number of active sessions right now
var countSessions = function() {
	return numSessions;
};

// run a function(fn) on all sessions
// will call: fn(sessionData)
var runOnAllSessions = function(fn) {
	var sess;
	for(var id in sessions) {
		if (sessions.hasOwnProperty(id)) {
			sess = this.findSession(id);
			if (sess) {
				fn(sess);
			}
		}
	}
};

exports.createSessionViaNow = createSessionViaNow;
exports.findSessionViaNow = findSessionViaNow;
exports.deleteSessionViaNow = deleteSessionViaNow;
exports.createSession = createSession;
exports.findSession = findSession;
exports.deleteSession = deleteSession;
exports.countSessions = countSessions;
exports.runOnAllSessions = runOnAllSessions;

