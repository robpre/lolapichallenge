var io = require('socket.io-client');

module.exports = function() {
	var sock = io({autoConnect: false});
	window.DEBUGSOCKET=  sock;
	return sock;
};