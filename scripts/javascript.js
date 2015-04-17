var browserify = require('browserify');
var Q = require('q');
var fs = require('fs');
var debug = require('debug')('urf:scripts:javascript');
var excorsist = require('exorcist');

var dev = process.env.NODE_ENV === 'development';

module.exports = function(bundle) {
	// relative from project root
	var scripts = [
		'./client/js/main.js'
	];
	debug('Compiling ', scripts.join(''), ' to ', bundle);
	return Q.Promise(function(resolve, reject) {
		var b = browserify({
			debug: dev
		});

		scripts.forEach(function( scriptPath ) {
			b.add(scriptPath);
		});

		var dataStream = b.bundle();

		if(dev) {
			dataStream = dataStream.pipe(excorsist(bundle + 'public/js/bundle.js.map'));
		}
		dataStream.pipe(fs.createWriteStream(bundle + 'public/js/bundle.js'))
			.on('finish', resolve)
			.on('error', reject);
	});
};
