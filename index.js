var express = require('express');
var fs = require('fs');
var Q = require('q');
var debug = require('debug')('urf:index');

var urf = express();
var api = require('./server');
var port = process.env.PORT || 9001;

var setup = {
	init: require('./scripts/init.js'),
	scripts: require('./scripts/scripts.js'),
	markup: require('./scripts/markup.js')
};

debug('Creating public folder and starting urf server');
setup.init(passDir(__dirname))
.then(function() {
	debug('Running setup.markup()');
	return setup.markup(passDir(__dirname));
}, rageQuit)
// once we're done 
.then(function() {
	debug('Running setup.scripts()');
	setup.scripts(passDir(__dirname))
		.pipe(fs.createWriteStream('public/js/bundle.js'))
		.on('finish', startServer)
		.on('error', handleBreakage);
}, rageQuit);


function startServer() {
	debug('Starting server');
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
