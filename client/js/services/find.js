var _ = require('lodash');
var Q = require('q');
module.exports = [function() {
	var lookForGame = function(gameConfig) {
		//make socket request
		var foundGame = Q.defer();
		setTimeout(function(){ 
			foundGame.resolve(gameConfig);
		}, 10000);

		return foundGame.promise;
	};

	return {
		game: lookForGame
	};
}];
