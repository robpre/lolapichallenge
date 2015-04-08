var browserify = require('browserify');
var Q = require('q');
var fs = require('fs');
var debug = require('debug')('urf:scripts:javascript');

module.exports = function(bundle) {
	// relative from project root
	var scripts = [
		'./client/js/main.js'
	];
	debug('Compiling ', scripts.join(''), ' to ', bundle);
	return Q.Promise(function(resolve, reject) {
		var b = browserify({
			debug: process.env.NODE_ENV === 'development'
		});

		scripts.forEach(function( scriptPath ) {
			b.add(scriptPath);
		});

		b.bundle().pipe(fs.createWriteStream(bundle + 'public/js/bundle.js'))
			.on('finish', resolve)
			.on('error', reject);
	});
};
