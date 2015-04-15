module.exports = function() {
	return {
		templateUrl: 'templates/directives/urf-card.html',
		restrict: 'E',
		scope: {
			card: '=',
			render: '@'
		},
		link: function(scope, element, attrs) {
		}
	};
};
