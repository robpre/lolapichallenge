var _ = require('lodash');
module.exports = function() {
	return {
		templateUrl: 'templates/directives/urf-map-entity.html',
		restrict: 'E',
		scope: {
			type: '@',
			team: '@',
			layer: '@',
			lane: '@'
		},
		link: function(scope, element, attrs) {
			if(scope.type === 'turret') {
				console.log('Made a map entity: '+scope.type+' '+scope.layer+'-'+scope.lane, scope);
			} else {
				console.log('Made a map entity: '+scope.type, scope);
			}
		}
	};
};
