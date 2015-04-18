var _ = require('lodash');
module.exports = ['$scope', 'urfDeck', 'socket', '$rootScope', function($scope, urfDeck, socket, $rootScope) {
	$scope.handler = {};
	$scope.handler.deck = urfDeck.get();	
	$scope.handler.cardPointer = 0;
	var setPointer = function(index) {
		$scope.handler.cardPointer = index;
	};
	$scope.setPointer = setPointer;
	var findEmpty  = function() {
		return _.findIndex($scope.handler.deck, function(card) {
			if(!card) {
				return true;
			}
			return false;
		});	
	};
	var findViable = function(index) {
		//use % when i have brain power
		if(index >= urfDeck.size()-1) {
			return 0;
		}
		return ++index;
	};
	var pointNext = function() {
		var nextEmpty = findEmpty();
		if(nextEmpty > 0) {
			setPointer(nextEmpty);	
		} else {
			setPointer(findViable($scope.handler.cardPointer));		
		}
	};
	var addCard = function(card) {
		//update scope copy
		$scope.handler.deck[$scope.handler.cardPointer] = card;	
		//send to service copy
		urfDeck.replace($scope.handler.cardPointer, card);
		pointNext();
	};
	var isDupe = function(card) {
		if(_.indexOf($scope.handler.deck, card)>=0) {
			return true;
		}
		return false;
	};

	$scope.$on('urfLobby->deckHandler.add', function(evt, card) {
		//someone wants to add a card
		if(!isDupe(card)) {
			addCard(card);
			console.log($scope.handler);
		}
	});
}];
