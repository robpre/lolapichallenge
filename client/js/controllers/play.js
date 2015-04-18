module.exports = ['$scope', 'deck', 'socket', function($scope, deck, socket) {
	
	$scope.findGame = function() {
		var toPlay = deck.toArray();
		if(toPlay.length === urfDeck.size()) {
			socket.emit('find game', toPlay);
		} else {
			$rootScope.$broadcast('flashMessage', {text: 'Pick some more cards'});
		}
	};
}];
