module.exports = ['$http', function($http) {
	return {
		login: function(username, password) {
			return $http.post('/login', {
				username: username,
				password: password
			});
		},
		logout: function() {
			return $http.post('/logout');
		}
	};
}];
