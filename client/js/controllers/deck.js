var _ = require('lodash');
module.exports = ['$scope', 'urfDeck', function($scope, urfDeck) {
	$scope.handler = {};
	$scope.handler.deck = urfDeck.get();	
	$scope.$on('urf.deck.add', function(evt, card) {
		//someone wants to add a card
		console.log('Adding card: ', card);
	});
}];
