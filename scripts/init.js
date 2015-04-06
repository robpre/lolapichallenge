var Q = require('q');
var mkdirp = require('mkdirp');

module.exports = function(root) {
	var path = root.replace(/[^\/]$/, function(str, match) {
		return match + '/';
	});
	var js = Q.defer();
	var css = Q.defer();
	// create public folder
	mkdirp(path + 'public/js', function(err) {
		if( err ) {
			console.log('failed to make public/js!', err);
			js.reject();
		} else {
			console.log('success! created public/js!');
			js.resolve();
		}
	});
	mkdirp(path + 'public/css', function(err) {
		if( err ) {
			console.log('failed to make public/css!', err);
			js.reject();
		} else {
			console.log('success! created public/css!');
			js.resolve();
		}
	});
	return Q.all([js, css]);
};