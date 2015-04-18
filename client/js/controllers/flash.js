var _ = require('lodash');

module.exports = ['$scope', '$timeout', function($scope, $timeout) {
	$scope.messages = [];
	$scope.$on('flashMessage', function(evt, message) {
		if(message) {
			switch(message.type) {
				case 'alert-success':
				case 'alert-info':
					$timeout(function() {
						_.remove($scope.messages, message);
					}, 5000);
				break;
				case 'alert-danger':
				// these are ok
				break;
				default:
					message.type = 'alert-info';
				break;
			}

			$scope.messages.push(message);
		}
	});

	$scope.removeMessage = function(i) {
		$scope.messages.splice(i, 1);
	};
}];
