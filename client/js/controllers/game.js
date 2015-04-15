var lux = require('../../lux.json');

module.exports = ['$scope', 'socket', function($scope, socket) {
	$scope.card = lux;

	socket.emit('get me cards', function() {

	});

	socket.on('got cards', function() {

	});
}];
