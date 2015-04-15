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
			scope.data = {
				card: _.clone(scope.card, true)
			};
			if(!scope.size) {
				scope.size = 'regular';
			} 
			if(!scope.data.card || _.size(scope.data.card) === 0) {
				scope.data.card = false;
			}
		}
	};
};
