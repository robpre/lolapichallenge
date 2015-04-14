var angular = require('angular');
// deps
angular.module('urf', [require('angular-route')])
	.controller('urfIndex', require('./controllers/index.js'))
	.controller('urfLobby', require('./controllers/lobby.js'))
	.controller('urfGame', require('./controllers/game.js'))
  	.controller('urfNav', ['$scope', function($scope, $element) {
		$scope.enabled = false;
		$scope.$on('urfUtility.nav.off', function() {
			console.log('urfUtility.nav.off');
			$scope.enabled = false;
			console.log($scope, $element);
		});
		$scope.$on('urfUtility.nav.on', function() {
			console.log('urfUtility.nav.on');
			$scope.enabled = true;
			console.log($scope, $element);
		}); 
	}])
	.directive('urfCard', require('./directives/urf-card.js'))
	.service('urfUtility', ['$rootScope', function($rootScope) {
		var navStatus = false;
		return {
			enableNav : function(enable) {
				if(!enable) {
					if(navStatus !== false) {
						$rootScope.$broadcast('urfUtility.nav.off');
					} 
					navStatus = false;
				} else {
					if(navStatus !== true) {
						$rootScope.$broadcast('urfUtility.nav.on');
					}
					navStatus = true;
				}
			}
		};
	}])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: '../templates/index.html',
			controller: 'urfIndex',
			resolve: {
				'tabStatus': function(urfUtility) {
					urfUtility.enableNav(false);
				}
			}
		});
		$routeProvider.when('/lobby', {
			templateUrl: '../templates/lobby.html',
			controller: 'urfLobby',
			resolve: {
				'tabStatus': function(urfUtility) {
					urfUtility.enableNav(true);
				}
			}
		});
		$routeProvider.when('/game', {
			templateUrl: '../templates/game.html',
			controller: 'urfGame',
			resolve: {
				'tabStatus': function(urfUtility) {
					urfUtility.enableNav(false);
				}
			}
		});
	}])
	.run(['$rootScope', '$window', 'urfUtility', function($rootScope, $window, urfUtility) {
		$rootScope.$on('routeChangeSuccess', function(evt, next, current) {
			var windowLocation = (window.pageYOffset || document.documentElement.scrollTop);
			if(windowLocation !== 0) {
				$window.scrollTo(0, 0);
			}
		});
	}]);
