var debug = require('debug')('urf:server:game:index');
var ObjectID = require('mongodb').ObjectID;

function Game(database, playerOne) {
	this.database = database;

	// generates a new ID
	this.id = new ObjectID();

	this.clients = [playerOne];
}

Game.prototype.addClient = function(user, cb) {
	if(this.hasSpace()) {
		this.clients.push(user);
	}
};

// maybe do some other shit
Game.prototype.ready = function() {
	return !this.hasSpace();
};

Game.prototype.hasSpace = function() {
	return this.clients.length === 1;
};

Game.prototype.getActiveSockets = function() {
	return this.clients.map(function(client) {
		return client.socket;
	});
};

// DO NOT USE THIS TO SAVE TO DB ATM
// because ObjectID will create new ids during application runtime
// then reset to ObjectID 0 on server restart
Game.prototype.serialize = function() {
	return {

	};
};

module.exports = Game;