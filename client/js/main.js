var angular = require('angular');
// deps
angular.module('urf', [require('angular-route')])
	.controller('urfRoot', require('./controllers/root.js'))
	.directive('urfCard', require('./directives/urf-card.js'))
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'templates/root.html',
			controller: 'urfRoot'
		});
	}])
	.run(['$rootScope', '$window', function($rootScope, $window) {
		$rootScope.$on('routeChangeSuccess', function(evt, next, current) {
			var windowLocation = (window.pageYOffset || document.documentElement.scrollTop);
			if(windowLocation !== 0) {
				$window.scrollTo(0, 0);
			}
		});
	}]);
