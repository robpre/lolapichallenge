var io = require('socket.io-client');

module.exports = function() {
	return io({autoConnect: false});
};