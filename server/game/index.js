var debug = require('debug')('urf:server:game:index');
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

var GameMap = require('./map.js');
var Progress = require('./progress.js');

function Game(database, playerOne) {
	this.database = database;

	// generates a new ID
	this.id = new ObjectID();

	this.clients = [];
	this.addClient(playerOne);

	this.finished = false;

	this.map = [
		new GameMap(),
		new GameMap()
	];

	this.progress = new Progress();

	this.turn = Math.random() >= 0.5 ? 1 : 0;

	return this;
}

Game.prototype.start = function() {
	this.broadcast('game state', this.serialize());
};

// 
Game.prototype.action = function(playerID, actionName, cb) {

};

Game.prototype.defend = function(playerIDvar) {

};
Game.prototype.attack = function() {

};

Game.prototype.endPreround = function(uid) {

};

Game.prototype.addClient = function(user) {
	if(this.hasSpace()) {
		// user.deck is provided already
		user.destroyedDeck = [];
		this.clients.push(user);
	}
};

Game.prototype.over = function(cb) {
	var database = this.database;
	var clients = this.clients;
	var written = 0;
	this.database.writeResult(this.serialize(), function(err, writtenDoc) {
		if(err) {
			return cb(err);
		}
		function done() {
			written++;
			if(written === clients.length) {
				cb(writtenDoc._id);
			}
		}
		clients.forEach(function(client) {
			database.updateUser(client._id, {
				$push: writtenDoc._id
			}, done);
		});
	});
};

// maybe do some other shit
Game.prototype.isReady = function() {
	return !this.hasSpace();
};

Game.prototype.hasSpace = function() {
	return this.clients.length === 1;
};

Game.prototype.broadcast = function() {
	var args = _.toArray(arguments);
	this.getActiveSockets().forEach(function(socket) {
		debug('triggering...', args);
		socket.emit.apply(socket, args);
	});
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

Game.prototype.getClient = function(i, cards) {
	return cards ? this.clients[i] : _.omit(this.clients[i], 'deck');
};

// DO NOT USE THIS TO SAVE TO DB ATM
// because ObjectID will create new id++ during application runtime
// then reset to ObjectID 0 on server restart
Game.prototype.serialize = function(uid) {
	var activePlayerIndex = _.findIndex(this.clients, function(c) {
		return c._id === uid;
	});
	var enemyIndex = activePlayerIndex ? 0 : 1;
	var enemy = this.clients[enemyIndex];
	var player = this.clients[activePlayerIndex];
	debug('active player', player);
	debug('enemy', enemy);

	return {
		players: {
			blue: this.getClient(activePlayerIndex, true),
			red: this.getClient(enemyIndex)
		},
		map: {
			blue: this.map[activePlayerIndex].serialize(),
			red: this.map[enemyIndex].cardLess()
		},
		preround: this.preround.serialize()
	};
};

module.exports = Game;