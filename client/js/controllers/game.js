module.exports = ['$scope', 'urfFind', function($scope, urfFind) {
	$scope.game = {
		current: false,
	};
	if(!$scope.game.current) {
		urfFind.game({deck: 'poop'}).then(function(game) {
			$scope.game.current = game;			
			$scope.$apply();
		});
	}
}];
