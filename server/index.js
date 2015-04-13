var debug = require('debug')('urf:server:index');
var socketIO = require('socket.io');
var DB = require('./db.js');

module.exports = function(httpInst, mongoURL/*, apiKey*/) {
	var io = socketIO(httpInst, { serveClient: false });

	io.on('connection', function(socket) {
		debug('user connected');
	});

	return io;
};
