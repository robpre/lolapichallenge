var debug = require('debug')('urf:server:configure_socket');
var _ = require('lodash');

var Game = require('./game');

function broadcast(sockets) {
	var args = _.toArray(arguments).slice(1);
	sockets.forEach(function(socket) {
		debug('triggering...', args);
		socket.emit.apply(socket, args);
	});
}

function handleError(socket) {
	return function(err, message, type) {
		if(err) {
			debug(String(type).toUpperCase() + ' socket error: ' + message, err);
			socket.emit('urfError', {
				message: message || 'fatal',
				type: type || 'fatal'
			});
		}
		return !!err;
	};
}

// database is an *hopefully* connected instance of the ./db module
function ConfigureSocket(database) {
	this.database = database;

	// array of new Games
	this.games = [];
}

ConfigureSocket.prototype.handle = function(socket, session) {
	var error = handleError(socket);
	var database = this.database;
	var handler = this;

	/**
	 * findUser will only fire the callback if success
	 */
	function findUser(callback) {
		database.getUser(session.loggedInUser, function(err, userObj) {
			if(!error(err, 'trouble finding user')) {
				callback(userObj);
			}
		});
	}

	socket.on('give me bank cards', function(callback) {
		findUser(function(userObj) {
			callback(userObj.bank);
		});
	});

	socket.on('find game', function(deck, callback) {
		// deck == [] of ids
		// this will only find a user if they have all the cards
		database.getUsersCards(session.loggedInUser, deck, function(err, userObj, cards) {
			if(!error(err, 'can\'t find your cards: ', 'recoverable')) {
				// if there's a deck size miss-match treat the request as a failure
				if(!error(deck.length !== cards.length || cards.length !== 9, 'card number miss-match', 'recoverable')) {
					// otherwise continue
					debug(cards);
					var game = handler.findGame();
					var playerObj = {
						user: _.omit(userObj, 'bank'),
						deck: cards,
						socket: socket
					};

					if(!game) {
						game = handler.createGame(playerObj);
					} else {
						game.addClient(playerObj);
					}

					session.activeGameID = game.id;
					debug(game);
					session.save(function(err) {
						if(!error(err, 'error saving game to session', 'recoverable')) {
							debug('game is ready: ', game.ready());
							if(game.ready()) {
								broadcast(game.getActiveSockets(), 'game found');
							}
						} else {
							broadcast(game.getActiveSockets(), 'game over');
						}
					});
				}
			}
		});
	});
};

ConfigureSocket.prototype.findGame = function() {
	return !!this.games.length && _.findWhere(this.games, function(game) {
		return game.hasSpace();
	});
};

ConfigureSocket.prototype.createGame = function(gameOwner) {
	var game = new Game(this.database, gameOwner);

	this.games.push(game);
	return game;
};

module.exports = ConfigureSocket;