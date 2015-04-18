module.exports = ['$scope', 'urfState', 'socket', function($scope, urfState, socket) {
	var cardPointer;
	$scope.game = {
		current: false,
	};
	$scope.setPointer = function(card) {
		cardPointer = card;	
	};
	$scope.attackEntity = function(position, lane) {
		//use card pointer
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
	};

	socket.on('game state', function(state) {
		urfState.load(state);
		processUi();
	});
	$scope.$on('urfFind.found', function() {
		processUi();
	});
}];
