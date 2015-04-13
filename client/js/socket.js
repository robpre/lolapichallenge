var io = require('socket.io-client');

module.exports = function(namespace) {


	return io(namespace);
};