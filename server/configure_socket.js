var debug = require('debug')('urf:server:configure_socket');

function handleError(socket) {
	return function(err, message, type) {
		if(err) {
			debug(String(type).toUpperCase() + ' socket error: ' + message, err);
			socket.emit('socketError', {
				message: message,
				type: type
			});
		}
		return !!err;
	};
}

// database is an *hopefully* connected instance of the ./db module
function ConfigureSocket(database) {
	this.database = database;
}

ConfigureSocket.prototype.handle = function(socket, session) {
	var error = handleError(socket);
	var database = this.database;

	socket.on('give me bank cards', function(name, callback) {
		debug(session);
		database.getUser(session.loggedInUser, function(err, userObj) {
			if(!error(err, 'trouble finding user', 'fatal')) {
				callback(userObj.bank);
			}
		});
	});
};

module.exports = ConfigureSocket;