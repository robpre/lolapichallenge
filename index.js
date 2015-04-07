var express = require('express');
var fs = require('fs');
var Q = require('q');
var debug = require('debug')('urf:index');

var baseDir = __dirname + '/';
var port = parseInt(process.env.PORT, 10) || 9001;
var key = process.env.API_KEY;

var urf = express();
var api = require('./server')(key);
var client = require('./server/client.js')(baseDir);

var setup = {
	init: require('./scripts/init.js'),
	scripts: require('./scripts/scripts.js'),
	markup: require('./scripts/markup.js')
};

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

debug('Creating public folder and starting urf server');
debug('Running setup.init()');
setup.init(baseDir)
// done init
.then(function() {
	debug('Running setup.markup()');
	return setup.markup(baseDir);
}, rageQuit)
// done markup
.then(function() {
	var scriptsDone = Q.defer();
	debug('Running setup.scripts()');
	setup.scripts(baseDir)
		.pipe(fs.createWriteStream('public/js/bundle.js'))
		.on('finish', scriptsDone.resolve)
		.on('error', scriptsDone.reject);

	return scriptsDone.promise;
}, rageQuit)
// done scripts
.then(function() {
	debug('Running startServer()');
	startServer();
}, rageQuit);
