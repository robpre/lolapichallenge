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

Game.prototype.getCardFor = function(i, cardId) {
	return _.findWhere(this.clients[i].deck, {_id: new ObjectID(cardId)});
};

// where === 'inhibitor.top'
Game.prototype.action = function(username, target, actionName, card, where, stat, cb) {
	var activePlayerIndex = _.findIndex(this.clients, function(c) {
		return c.user === username;
	});
	var enemyIndex = activePlayerIndex ? 0 : 1;
	var cardObj = this.getCardFor(activePlayerIndex, card);
	debug(username, target, actionName, card, where, stat);
	debug('action card obj', cardObj);
	if(cardObj && ['attack', 'defend'].indexOf(actionName) > -1) {
		switch(target) {
			case 'preround':
				if(this.progress.preround) {
					this.defend(activePlayerIndex, cardObj, where);
				}
			break;
			case 'round':
				if(!this.progress.preround && this.turn === activePlayerIndex) {
					switch(actionName) {
						case 'attack':
							this.attack(activePlayerIndex, enemyIndex, cardObj, where, stat);
						break;
						case 'defend':
							this.defend(activePlayerIndex, cardObj, where);
						break;
					}
					this.turn = this.turn ? 0 : 1;
				}
			break;
		}
	}
	this.broadcastGameState();
};

Game.prototype.defend = function(playerIndex, card, where) {
	var location = where.split('.')[0];
	var lane = where.split('.')[1];
	if(this.map[playerIndex] && this.map[playerIndex].open(location, lane)) {
		this.map[playerIndex].defend(location, lane, card);
		_.remove(this.clients[playerIndex].deck, card);
	}
};
Game.prototype.attack = function(playerIndex, enemyIndex, card, where, stat) {
	var location = where.split('.')[0];
	var lane = where.split('.')[1];
	if(this.map[enemyIndex] && this.map[enemyIndex].open(location, lane) && this.deciders[stat]) {
		var defendingCard = this.map[enemyIndex].getTurret(location, lane);
		debug('defending card obj', defendingCard);
		if(defendingCard) {
			if(this.deciders[stat](card.stats[stat], defendingCard.stats[stat])) {
				this.map[enemyIndex].destroy(location, lane);
				_.remove(this.clients[enemyIndex].deck, defendingCard);
				this.clients[enemyIndex].destroyedDeck.push(defendingCard);
			} else {
				_.remove(this.clients[playerIndex], card);
			}
		} else {
			this.map[enemyIndex].destroy(location, lane);
		}
	}
};

Game.prototype.broadcast = function() {
	var args = _.toArray(arguments);
	this.clients.forEach(function(user) {
		debug('triggering...', args);
		user.socket.emit.apply(user.socket, args);
	});
};

Game.prototype.endPreround = function(username) {
	if(this.progress.endPreroundForUser(username)) {
		this.broadcastGameState();
	}
};

Game.prototype.addClient = function(user) {
	if(this.hasSpace()) {
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
	debug(this.clients);
	return !this.hasSpace();
};

Game.prototype.hasSpace = function() {
	return this.clients.length < 2;
};

Game.prototype.broadcastGameState = function() {
	this.clients.forEach(function(user) {
		user.socket.emit('game state', this.serialize(user.user));
	}.bind(this));
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
	var without = cards ? ['socket', 'session'] : ['socket', 'session', 'deck'];
	return _.omit(this.clients[i], without);
};

// DO NOT USE THIS TO SAVE TO DB ATM
// because ObjectID will create new id++ during application runtime
// then reset to ObjectID 0 on server restart
Game.prototype.serialize = function(user) {
	var activePlayerIndex = _.findIndex(this.clients, function(c) {
		return c.user === user;
	});
	var enemyIndex = activePlayerIndex ? 0 : 1;
	var enemy = this.clients[enemyIndex];
	var player = this.clients[activePlayerIndex];
	debug('active player', activePlayerIndex);
	debug('enemy', enemyIndex);

	return {
		turn: this.clients[this.turn].user,
		yourTurn: this.turn === activePlayerIndex,
		players: {
			blue: this.getClient(activePlayerIndex, true),
			red: this.getClient(enemyIndex)
		},
		map: {
			blue: this.map[activePlayerIndex].serialize(),
			red: this.map[enemyIndex].cardLess()
		},
		progress: this.progress.serialize()
	};
};

module.exports = Game;