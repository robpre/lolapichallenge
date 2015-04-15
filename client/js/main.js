var angular = require('angular');
var io = require('./socket.js');

// deps
angular.module('urf', [require('angular-route')])
	.service('urfDeck', require('./services/deck.js'))
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
	.run(['$rootScope', '$window', function($rootScope, $window) {
		$rootScope.$on('routeChangeSuccess', function(evt, next, current) {
			var windowLocation = (window.pageYOffset || document.documentElement.scrollTop);
			if(windowLocation !== 0) {
				$window.scrollTo(0, 0);
			}
		});
	}]);

/**
 * I'll probably attach some clever stuff the wrapped socket require.
 * But the current login flow currently works like 
 * -> user connects to site and connects to the socket (using io())
 * -> this socket currently listens on two events, login and logout. 
 * -> emit( 'login', username )
 * -> client then can attempt to connect to the channel localhost:port/secure 
 * 		-> this currently takes two attempts.... ;_; 
 * 		-> for some fucking reason we end up having to do a round trip
 * 		-> var secureSocket = io('localhost:port/secure');
 * 		-> secureSocket.connect();
 * -> the secure channel will do account/game handling
 */
var socket = io();
var secureSocket;
function login(user) {
	socket.emit('login', user);
	// does socket.one exist?... basically bind once
	socket.one('logged in', function() {
		// this should connect us...
		secureSocket = io('//' + window.location.hostname + ':' + window.location.port);
		// but we need to do this so there's a roundtrip
		secureSocket.connect();
	});
}

function logout() {
	socket.emit('logout');
	// secureSocket.connected should be false now
}

// do it better with angular
window.login = login;
window.logout = logout;

socket.on('logged in', function() {
	console.log('logged in!');
});
socket.on('logged out', function() {
	console.log('logged out!');
	// TODO navigate to home page
});
