var debug = require('debug')('urf:server:game:index');
var ObjectID = require('mongodb').ObjectID;

function Game(database) {
	this.database = database;

	// generates a new ID
	this.id = new ObjectID();

	this.clients = [];
}

Game.prototype.addClient = function(uid, cb) {
	if(this.clients) {}
};

// defaults
Game.prototype.found = false;

// DO NOT USE THIS TO SAVE TO DB ATM
// because ObjectID
Game.prototype.serialize = function() {
	return {

	};
};

module.exports = Game;