// deps
var Q = require('q');
var debug = require('debug')('urf:index');
var que = require('./lib/que');
var Server = require('./server');
var shell = require('shelljs');

// setup some useful vars
var baseDir = __dirname + '/';
var port = parseInt(process.env.PORT, 10) || 9001;
// var API_KEY = process.env.API_KEY;
var MONGO_URL = process.env.MONGO_URL;
var SESSION_SECRET = process.env.SESSION_SECRET;
var SALT = process.env.URF_SALT;

// fetch build scripts
var scripts = {
	stub_folders: require('./scripts/stub_folders.js'),
	javascript: require('./scripts/javascript.js'),
	copy_markup_and_styles: require('./scripts/copy_markup_and_styles.js'),
};

function rageQuit() {
	console.error('Error!');
	shell.exec('notify-send "'+JSON.stringify(arguments)+'"', {async:true, silent:true});
	console.error.apply(console, arguments);
	process.exit(1);
}

function Urf() {
	if(!(this instanceof Urf)) {
		return new Urf();
	}

	this.app = new Server(MONGO_URL, SESSION_SECRET, baseDir, SALT);

	return this;
}

Urf.prototype.listen = function listen() {
	debug('Running listen()');
	var listenPromise = Q.defer();
	this.app.listen(port, function() {
		debug('Listening on port: ' + port);
		listenPromise.resolve();
	});
	return listenPromise.promise;
};

Urf.prototype.stop = function stop() {
	debug('Running stop()');
	var active = this.app;
	return Q.Promise(function(resolve) {
		active.close(function() {
			debug('Stopping server..');
			resolve.apply(null, arguments);
		});
	});
};

Urf.prototype.init = que(scripts.stub_folders, baseDir);
Urf.prototype.javascript = que(scripts.javascript, baseDir);
Urf.prototype.copyMarkupAndStyles = que(scripts.copy_markup_and_styles, baseDir);

Urf.prototype.setup = function() {
	debug('Running setup()');
	return this.init()
		.then(this.javascript)
		.then(this.copyMarkupAndStyles);
};

module.exports = function() {
	return new Urf();
};

if(!module.parent) {
	debug('Creating public folder and starting urf server');
	var urf = module.exports();
	urf.setup()
		.then(urf.listen.bind(urf))
		.then(function() {
			//we dont gaf about the return code for this
			shell.exec('notify-send "Server is up"', {async:true, silent:true});
		})
		.catch(rageQuit);
}
