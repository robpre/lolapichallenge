var debug = require('debug')('urf:server:configure_socket');

var Game = require('./game');

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
		database.getUsersCards(session.loggedInUser, deck, function(err, cards) {
			if(!error(err, 'cant find your cards', 'recoverable')) {
				// if there's a deck size miss-match treat the request as a failure
				if(!error(deck.length !== cards.length || cards.length !== 9, 'card number miss-match', 'recoverable')) {
					// otherwise continue
					
				}
			}
		});
	});
};

ConfigureSocket.prototype.createGame = function(gamesOwner) {
	var game = new Game(this.database);

	game.addClient(gamesOwner);

	this.games.push(game);
};

module.exports = ConfigureSocket;