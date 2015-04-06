var Q = require('q');
var cp = require('glob-copy');

module.exports = function(root) {
	var path = root.replace(/[^\/]$/, function(str, match) {
		return match + '/';
	});
	var copy = Q.defer();
console.log(path);
	cp(path + '/client/**/*.html', path + '/public', function(err, files) {
		if( err ) {
			console.log('aahhh fuck');
			copy.reject();
		} else {
			console.log('copied', files);
			copy.resolve();
		}
	});

	return copy.promise;
}