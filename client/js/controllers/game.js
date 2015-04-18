module.exports = ['$scope', 'urfState', function($scope, urfState) {
	$scope.game = {
		current: false,
	};
	$scope.$on('urfFind.found', function() {
		$scope.game.current = urfState.get();	
	});
}];
