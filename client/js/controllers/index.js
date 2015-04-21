module.exports = ['$scope', 'user', 'socket', '$rootScope', 'urfSpin', function($scope, user, socket, $rootScope, urfSpin) {
	$scope.loginObj = {};
	function message(err, success) {
		if(err) {
			$rootScope.$broadcast('flashMessage', {type: 'alert-danger', text: err});
		} else {
			$rootScope.$broadcast('flashMessage', {type: 'alert-success', text: success});
		}
	}
	$scope.logon = function() {
		// .spin();
		user.login($scope.loginObj.username, $scope.loginObj.password)
			.success(function(data, status) {
				socket.connect();
				switch(status) {
					case 201:
						message(null, 'Account created');
					break;
					default:
					case 200:
						message(null, 'Welcome back');
					break;
				}
			})
			.error(function(reply, status) {
				switch(status) {
					case 403:
						message('Incorrect password or username already taken');
					break;
					case 400:
						message('Bad request');
					break;
					default:
					case 500:
						message('Something went wrong');
					break;
				}
			})
			.finally(function() {
				// .stop();
			});
	};
}];
