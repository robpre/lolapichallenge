module.exports = ['$scope', '$rootScope', 'socket', function($scope, $rootScope, socket) {
	$scope.cards = [];
	///client code
	socket.emit('give me bank cards', function(bankCards) {
		$scope.cards = bankCards;
		$scope.$apply();
	});
	$scope.addToDeck = function(card) {
		$rootScope.$broadcast('urfLobby->deckHandler.add', card);
	};
}];
