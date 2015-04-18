module.exports = ['$scope', '$rootScope', 'urfDeck', 'urfFind', '$location', function($scope, $rootScope, urfDeck, urfFind, $location) {
	$scope.findGame = function() {
		var toPlay = urfDeck.getArray();
		if(toPlay.length === urfDeck.size()) {
			console.log('Looking for a game');
			urfFind.game(toPlay).then(function() {
				console.log('Found a game, passed to state');
			}, function() {
				$rootScope.$broadcast('flashMessage', {text: 'Something went wrong finding you a game'});
			});

			$location.path('/game');
		} else {
			$rootScope.$broadcast('flashMessage', {text: 'Pick some more cards'});
		}
	};
}];
