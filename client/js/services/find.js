var _ = require('lodash');
var Q = require('q');
module.exports = ['socket', 'urfState', function(socket, urfState) {
	var lookForGame = function(gameConfig) {
		//make socket request
		var foundGame = Q.defer();
		console.log('Finding...');
		socket.emit('find game', gameConfig);
		socket.once('game found', function(startingState) {
			console.log('Found a game');
			urfState.load(startingState);	
			foundGame.resolve();
		});
		return foundGame.promise;
	};
	return {
		game: lookForGame
	};
}];
