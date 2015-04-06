var express = require('express');
var fs = require('fs');
var Q = require('q');
var debug = require('debug')('urf:index');

var port = parseInt(process.env.PORT, 10) || 9001;
var key = process.env.API_KEY;

var urf = express();
var api = require('./server')(key);

var setup = {
	init: require('./scripts/init.js'),
	scripts: require('./scripts/scripts.js'),
	markup: require('./scripts/markup.js')
};

debug('Creating public folder and starting urf server');
debug('Running setup.init()');
setup.init(passDir(__dirname))
// done init
.then(function() {
	debug('Running setup.markup()');
	return setup.markup(passDir(__dirname));
}, rageQuit)
// done markup
.then(function() {
	var scriptsDone = Q.defer();
	debug('Running setup.scripts()');
	setup.scripts(passDir(__dirname))
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


function startServer() {
	// TODO: move to server/client
	urf.use('/', express.static(passDir(__dirname) + 'public/'));
	urf.get('/', function(req, res) {
		res.redirect('/index.html');
	});

	urf.use('/api', api);

	urf.listen(port);
	debug('Listening on port: ' + port);
}

function rageQuit() {
	console.error.apply(console, arguments);
	process.exit(1);
}

function passDir(dir) {
	return dir + '/';
}
