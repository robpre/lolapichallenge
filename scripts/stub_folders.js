var Q = require('q');
var mkdirp = require('mkdirp');
var debug = require('debug')('urf:scripts:init');

function createFolderPromise(path) {
	return Q.promise(function(resolve, reject) {
		mkdirp(path, function(err) {
			if( err ) {
				debug('Failed to make ' + path, err);
				reject(err);
			} else {
				debug('Success! created ' + path);
				resolve();
			}
		});
	});
}

module.exports = function(path) {
	return Q.all([
		createFolderPromise(path + 'public/js'),
		createFolderPromise(path + 'public/css'),
		createFolderPromise(path + 'public/templates/directives'),
		createFolderPromise(path + 'public/fonts')
	]);
};
