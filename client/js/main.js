var angular = require('angular');
var io = require('./socket.js');

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