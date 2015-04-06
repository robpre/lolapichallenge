var Q = require('q');
var cp = require('glob-copy');
var debug = require('debug')('urf:scripts:markup');

module.exports = function(path) {
	var copy = Q.defer();

	cp(path + '/client/**/*.html', path + '/public', function(err, files) {
		if( err ) {
			debug('Failed to copy markup.');
			copy.reject();
		} else {
			debug('Successful copy', files);
			copy.resolve();
		}
	});

	return copy.promise;
}
