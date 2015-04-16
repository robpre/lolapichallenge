var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('urf:server:client');

module.exports = function(baseDir, sessionMiddleware, cookieParser, database) {
	var client = express();

	client.use(bodyParser.json());
	client.use(cookieParser);
	client.use(sessionMiddleware);
	client.use('/', express.static(baseDir + 'public/'));
	client.get('/', function(req, res) {
		res.redirect('/index.html');
	});

	client.post('/logout', function(req, res) {
		req.session.loggedInUser = null;
		req.session.save(function(err) {
			if(err) {
				debug('error trying to log out', err);
				res.status(500);
				return res.end('internal error/cookie error');
			}
			res.status(200);
			res.end('success');
		});
	});

	client.post('/login', function(req, res) {
		// fetch  username and password from the request body
		var password = req.body.password;
		var username = req.body.username;
		// handle missing data, returning a 400 and a message
		if(!password || !username) {
			res.status(400);
			return res.end('Missing ' + (username ? 'password' : 'username'));
		}

		// if all good attempt to login/create account
		database.login(username, password, function(err, userObj, fresh) {
			if(err) {
				res.status(403);
				debug('error trying to log in', err);
				return res.end('password missmatch');
			}

			// attach to the session
			req.session.loggedInUser = userObj._id;
			// save the session
			req.session.save(function(err) {
				if(err) {
					debug('error creating user', err);
					res.status(500);
					return res.end('internal error/cookie error');
				}
				// write data to the response
				res.status(fresh ? 201 : 200);
				res.end('success');
			});
		});
	});
	return client;
};