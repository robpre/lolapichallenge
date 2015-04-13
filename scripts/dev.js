var server = require('../');
var gaze = require('gaze');
var debug = require('debug')('urf:scripts:dev');

var urf = server();

function error() {
	console.error.apply(console, arguments);
}
debug('Running development instance, watching for file changes');
function listenForFileChanges() {
	gaze('client/**/*.js', function(err) {
		if(err) {
			return error(err);
		}

		this.on('all', function(type, file) {
			debug(type + ' ' + file);
			urf.stop()
				.then(urf.javascript)
				.fin(urf.listen.bind(urf))
				.catch(error);
		});
	});
	gaze(['client/**/*.scss', 'client/**/*.html'], function(err, watcher) {
		if(err) {
			return error(err);
		}

		this.on('all', function(type, file) {
			debug(type + ' ' + file);
			urf.stop()
				.then(urf.copyMarkupAndStyles)
				.fin(urf.listen.bind(urf))
				.catch(error);
		});
	});
	gaze('server/**/*.js', function(err, watcher) {
		if(err) {
			return error(err);
		}

		this.on('all', function(type, file) {
			debug(type + ' ' + file);
			urf.stop()
				.fin(urf.listen.bind(urf))
				.catch(error);
		});
	});
}

urf.setup()
	.then(urf.listen.bind(urf))
	.then(listenForFileChanges)
	.catch(error);
