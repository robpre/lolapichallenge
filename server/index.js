var debug = require('debug')('urf:server:index');
var socketIO = require('socket.io');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var DB = require('./db.js');

module.exports = function(httpInst, mongoURL, secret/*, apiKey*/) {
	var io = socketIO(httpInst, { serveClient: false });
	// var securedIO = io;
	var database = new DB(mongoURL);

	database.connect(function(err, db) {
		// create our session handler
		var sessionManagerMiddleware = session({
			secret: secret,
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({
				db: db
			})
		});
		// inject it
		var sessionedSocket = io.use(function(socket, next) {
			sessionManagerMiddleware(socket.request, socket.request.res, next);
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
					socket.emit('logged in');
				});
			});
			socket.on('logout', function() {
				socket.request.session.user = null;
				socket.emit('logged out');
			});
		});

		var secureSessionedSocket = sessionedSocket.use(function(socket, next) {
			// Super simple check
			if(socket.request.session.user) {
				next();
			}
		});
		// now we have our secure sessioned sockets
		secureSessionedSocket.on('connection', function(socket) {
			socket.emit('logged in! ', socket.request.session.user);
		});

	});

	return io;
};
