var _ = require('lodash');
module.exports = ['$scope', 'urfState', 'socket', function($scope, urfState, socket) {
	$scope.cardPointer = null;
	$scope.statPointer = null;
	$scope.game = {
		current: false,
	};

	$scope.setStatPointer = function(stat) {
		$scope.statPointer = stat;
	};
	$scope.setPointer = function(cardId) {
		$scope.cardPointer = cardId;
	};
	$scope.attackEntity = function(position, lane) {
		//use card pointer
		if($scope.cardPointer !== null && $scope.statPointer !== null) {
			socket.emit('action', $scope.game.round.type, 'attack', $scope.cardPointer._id, position + '.' + lane, $scope.statPointer);
		}
	};
	$scope.defendEntity = function(position, lane) {
		//use card pointer
	};
	$scope.endTurn = function() {};

	var processUi = function() {
		$scope.game.current = urfState.get();	
		//map
		$scope.game.map = urfState.map();
		//deck
		$scope.game.deck = urfState.cards();
		//messages
		$scope.game.messages = urfState.messages();
		//round
		$scope.game.round = urfState.round();
		//refresh pointers lazy
		$scope.cardPointer = null;
		$scope.statPointer = null;
	};

	socket.on('game state', function(state) {
		urfState.load(state);
		processUi();
	});
	$scope.$on('urfFind.found', function() {
		processUi();
	});
}];
