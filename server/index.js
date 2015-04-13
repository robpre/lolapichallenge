var debug = require('debug')('urf:server:index');
var socketIO = require('socket.io');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var DB = require('./db.js');

function wrapExpressMiddlware(fn) {
	return function(socket, next) {
		fn(socket.request, socket.request.res, next);
	};
}

module.exports = function(httpInst, mongoURL, secret/*, apiKey*/) {
	var io = socketIO(httpInst, { serveClient: false });
	// var securedIO = io;
	var database = new DB(mongoURL);

	database.connect(function(err, db) {
		if(err) {
			return debug('ERROR CONNECTING TO MONGODB', err);
		}
		// create our session handler
		var sessionManagerMiddleware = wrapExpressMiddlware(session({
			secret: secret,
			resave: true,
			saveUninitialized: true,
			store: new MongoStore({
				db: db
			})
		}));
		// inject it
		var sessionedSocket = io.use(sessionManagerMiddleware);
		// secure namespaced socket
		var secureSessionedSocket = io.of('/secure');
		secureSessionedSocket.use(sessionManagerMiddleware)
			.use(function(socket, next) {
				// Super simple check
				debug('secure sess', socket.request.session);
				if(socket.request.session.user) {
					next();
				}
			});

		// now our sockets have sessions
		sessionedSocket.on('connection', function(socket) {
			debug('user connected');
			debug(socket.request.session);
			socket.on('login', function(username) {
				debug(username + ' requested login');
				database.login(username, function(err, user) {
					if(err) {
						return socket.emit('error', err);
					}
					socket.request.session.user = user;
					debug('logged in with user', user);
					socket.emit('logged in');
				});
			});
			socket.on('logout', function() {
				socket.request.session.user = null;
				socket.emit('logged out');
			});
		});

		// now we have our secure sessioned sockets
		secureSessionedSocket.on('connection', function(socket) {
			debug('logged in !', socket.request.session.user);
		});

	});

	return io;
};
