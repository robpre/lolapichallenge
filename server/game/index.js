var debug = require('debug')('urf:server:game:index');
var ObjectID = require('mongodb').ObjectID;

var GameMap = require('./map.js');

function Game(database, playerOne) {
	this.database = database;

	// generates a new ID
	this.id = new ObjectID();

	this.clients = [playerOne];

	this.finished = false;

	this.map = [
		new GameMap(),
		new GameMap()
	];

	return this;
}

Game.prototype.defend = function() {};
Game.prototype.attack = function() {};

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

Game.prototype.deciders = {
	assists: function(attackStat, defStat) {
		return attackStat > defStat;
	},
	deaths: function(attackStat, defStat) {
		return defStat > attackStat;
	},
	goldEarned: function(attackStat, defStat) {
		return attackStat > defStat;
	},
	kills: function(attackStat, defStat) {
		return attackStat > defStat;
	},
	largestKillingSpree: function(attackStat, defStat) {
		return attackStat > defStat;
	},
	// -1 means a loose
	winSpeed: function(attackStat, defStat) {
		if( defStat !== -1 && attackStat !== -1 ) {
			return attackStat < defStat;
		} else {
			// if the defending card lost(its game) then the attacking card wins this matchup
			return defStat === -1;
		}
	}
};

// Game.prototype.

// DO NOT USE THIS TO SAVE TO DB ATM
// because ObjectID will create new id++ during application runtime
// then reset to ObjectID 0 on server restart
Game.prototype.serialize = function() {
	return {

	};
};

module.exports = Game;