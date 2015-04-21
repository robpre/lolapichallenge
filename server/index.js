var debug = require('debug')('urf:server:index');
var socketIO = require('socket.io');
var SessionSockets = require('session.socket.io');
var http = require('http');
var express = require('express');

var clientFactory = require('./client.js');
var sessionFactory = require('./session.js');
var ConfigureSocket = require('./configure_socket.js');
var DB = require('./db');

function Server(mongoURL, secret, staticFileDir, salt) {
	if(!mongoURL || !secret || !staticFileDir) {
		return debug('CANT DO THAT WITHOUT mongoURL:' + mongoURL + ' || secret:' + secret + ' || staticFileDir:' + staticFileDir);
	}
	this.database = new DB(mongoURL, salt);
	this.secret = secret;
	this.staticFileDir = staticFileDir;
	this.salt = salt;

	return this;
}

Server.prototype.listen = function(port, cb) {
	var urfServer = this;
	var database = this.database;

	this.database.connect(function(err, db) {
		if(err) {
			debug('ERROR CONNECTING TO MONGODB', err);
			return cb(err);
		}

		var sesh = sessionFactory(db, urfServer.secret);

		// instantiate our client using the expressSession and cookieParser from the factory
		// so they are shared between the client and socket io
		var client = clientFactory(urfServer.staticFileDir, sesh.expressSession, sesh.cookieParser, database);
		var httpInst = http.Server(client);
		var io = socketIO(httpInst, { serveClient: false });

		var sessionedSocket = new SessionSockets(io, sesh.store, sesh.cookieParser);
		var socketConfigrationHandler = new ConfigureSocket(database);

		// do basic authing and make sure we manage bad users
		sessionedSocket
			.on('connection', function(err, socket, session) {
				if(err) {
					return debug('Error setting up session! ', err);
				}
				// session.reload(function() {
					if(!session.loggedInUser) {
						debug('user not authed, closing socket');
						return socket.disconnect();
					}
					debug(session);
					socketConfigrationHandler.handle(socket, session);
				// });
			});

		urfServer.socket = sessionedSocket;
		urfServer.httpInst = httpInst;

		httpInst.listen(port, cb);
	});
};

Server.prototype.close = function(cb) {
	this.database.close();
	if(this.httpInst) {
		this.httpInst.close(cb);
	}
};

module.exports = Server;
