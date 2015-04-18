var angular = require('angular');
var _ = require('lodash');
// deps
angular.module('urf', [require('angular-route')])
	.service('user', require('./services/user.js'))
	.service('socket', require('./services/socket.js'))
	.service('urfDeck', require('./services/deck.js'))
	.service('urfFind', require('./services/find.js'))
	.controller('flash', require('./controllers/flash.js'))
	.controller('urfIndex', require('./controllers/index.js'))
	.controller('urfDeckHandler', require('./controllers/deck.js'))
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
	.directive('urfMapEntity', require('./directives/urf-map-entity.js'))
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
	.run(['$rootScope', '$window', 'socket', '$location', 'user', function($rootScope, $window, socket, $location, user) {
		//on disconnect redirect back to home and post a logout
		socket.on('connection', function() {
			$location.path('/lobby');
		});
		//on connection redirect to lobby
		socket.on('disconnected', function() {
			var goHome = function() {
				$location.path('/');
			};
			user.logout().then(goHome, goHome);
		});

		$rootScope.$on('$locationChangeStart', function(evt, nextUrl, currentUrl) {
			if(!socket.connected) {
				$location.path('/');
			}
			window.socket = socket;
		});
		$rootScope.$on('$routeChangeSuccess', function(evt, next, current) {
			var windowLocation = (window.pageYOffset || document.documentElement.scrollTop);
			if(windowLocation !== 0) {
				$window.scrollTo(0, 0);
			}
			// clear flash messages on navigation
			$rootScope.$broadcast('flashMessage');
		});
	}]);
