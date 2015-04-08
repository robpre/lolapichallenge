var express = require('express');
var fs = require('fs');
var Q = require('q');
var debug = require('debug')('urf:index');
var que = require('./lib/que');

var baseDir = __dirname + '/';
var port = parseInt(process.env.PORT, 10) || 9001;
var key = process.env.API_KEY;

// server setup
var urf = express();
var api = require('./server')(key);
var client = require('./server/client.js')(baseDir);
function rageQuit() {
	console.error.apply(console, arguments);
	process.exit(1);
}

function startServer() {
	urf.use('/', client);
	urf.use('/api', api);

	urf.listen(port);
	debug('Listening on port: ' + port);
}

// client setup
var scripts = {
	stub_folders: require('./scripts/stub_folders.js'),
	javascript: require('./scripts/javascript.js'),
	copy_markup_and_styles: require('./scripts/copy_markup_and_styles.js'),
};
function setup() {
	var promise;
	promise = scripts.stub_folders(baseDir);

	promise = promise.then(que(scripts.javascript, baseDir));

	promise = promise.then(que(scripts.copy_markup_and_styles, baseDir));

	return promise;
}

debug('Creating public folder and starting urf server');
debug('Running setup()');

setup()
	.then(function() {
		debug('Running startServer()');
		startServer();
	})
	.catch(rageQuit);
