var express = require('express');

module.exports = function(baseDir, sessionMiddleware, cookieParser) {
	var client = express();

	client.use(cookieParser);
	client.use(sessionMiddleware);
	client.use('/', express.static(baseDir + 'public/'));
	client.get('/', function(req, res) {
		res.redirect('/index.html');
	});

	client.post('/login', function() {
		
	});
	return client;
};