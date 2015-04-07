var express = require('express');

module.exports = function(baseDir) {
	var client = express();
	client.use('/', express.static(baseDir + 'public/'));
	client.get('/', function(req, res) {
		res.redirect('/index.html');
	});
	return client;
};