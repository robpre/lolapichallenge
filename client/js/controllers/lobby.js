var lux = require('../../lux.json');
module.exports = ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.card = lux;
	$scope.addToDeck = function(card) {
		$rootScope.$broadcast('urfLobby->deckHandler.add', card);
	};
}];
