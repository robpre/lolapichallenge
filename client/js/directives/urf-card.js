module.exports = [function() {
	return {
		templateUrl: 'templates/directives/urf-card.html',
		restrict: 'E',
		scope: {
			card: '='	
		},
		link: function(scope) {
			console.log(scope.card.champion.name);
		}
	};
}];
