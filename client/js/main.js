var angular = require('angular');
var _ = require('lodash');

require('angular-bootstrap');

angular.module('urf', [require('angular-route'), 'ui.bootstrap', require('angular-spinner')])
	.filter('humanize', require('./filters/humanize.js'))
	.service('user', require('./services/user.js'))
	.service('socket', require('./services/socket.js'))
	.service('urfDeck', require('./services/deck.js'))
	.service('urfState', require('./services/state.js'))
	.service('urfFind', require('./services/find.js'))
	.controller('flash', require('./controllers/flash.js'))
	.controller('urfPlay', require('./controllers/play.js'))
	.controller('urfIndex', require('./controllers/index.js'))
	.controller('urfDeckHandler', require('./controllers/deck.js'))
	.controller('urfLobby', require('./controllers/lobby.js'))
	.controller('urfGame', require('./controllers/game.js'))
  	.controller('urfNav', ['$scope', function($scope, $element) {
		$scope.enabled = false;
		$scope.$on('urfUtility.nav.off', function() {
			$scope.enabled = false;
		});
		$scope.$on('urfUtility.nav.on', function() {
			$scope.enabled = true;
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
		$routeProvider
			.when('/', {
				templateUrl: '../templates/index.html',
				controller: 'urfIndex',
				resolve: {
					'tabStatus': function(urfUtility) {
						urfUtility.enableNav(false);
					}
				}
			})
			.when('/lobby', {
				templateUrl: '../templates/lobby.html',
				controller: 'urfLobby',
				resolve: {
					'tabStatus': function(urfUtility) {
						urfUtility.enableNav(true);
					}
				}
			})
			.when('/game', {
				templateUrl: '../templates/game.html',
				controller: 'urfGame',
				resolve: {
					'tabStatus': function(urfUtility) {
						urfUtility.enableNav(false);
					}
				}
			})
			.otherwise({redirectTo: '/'});
	}])
	.run(['$rootScope', '$window', 'socket', '$location', 'user', '$timeout', function($rootScope, $window, socket, $location, user, $timeout) {
		//on connection redirect to lobby
		socket.on('connect', function() {
			$location.path('/lobby').replace();
		});

		//on disconnect redirect back to home and post a logout
		socket.on('disconnect', function() {
			user.logout().finally(function() {
				$location.path('/').replace();
			});
		});

		socket.on('urfError', function(message) {
			$rootScope.$broadcast('flashMessage', {
				text: message.message,
				type: message.type === 'fatal' ? 'alert-danger' : 'alert-info'
			});
			if(message.type === 'fatal') {
				socket.disconnect();
			} else if(message.type === 'recoverable') {
				$location.path('/lobby').replace();
			}
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
