var _ = require('lodash');
module.exports = function() {
	return {
		templateUrl: 'templates/directives/urf-card.html',
		restrict: 'E',
		scope: {
			card: '=',
			render: '@',
			tile: '@',
			size: '@'
		},
		link: function(scope, element, attrs) {
			if(!scope.size) {
				scope.size = 'regular';
			} 
		}
	};
};
