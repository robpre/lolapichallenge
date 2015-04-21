var Spin = require('spin.js');

module.exports = ['urfSpinner', function(urfSpinner) {
	return {
		restrict: 'E',
		scope: {},
		link: function(scope, element, attrs) {
			scope.enable = function() {
				Spin.spin(element[0]);
			};
			urfSpinner.register(scope);
		}
	};
}];