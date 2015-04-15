module.exports = ['$scope', function($scope) {
	$scope.$on('flashMessage', function(evt, message) {
		$scope.message = message || {};

		switch($scope.message.type) {
			case 'alert-success':
			case 'alert-danger':
			case 'alert-info':
			// these are ok
			break;
			default:
				$scope.message.type = 'alert-info';
			break;
		}
	});
}];
