var Q = require('q');
var glob = require('glob');
var fs = require('fs');

function copyFile(from, to) {
	var copy = Q.defer();
	// console.log('copying from', from);
	// console.log('to', to);
	fs.createReadStream(from)
		.pipe(fs.createWriteStream(to))
		.on('done', copy.resolve)
		.on('error', copy.reject);
	return copy.promise;
}

module.exports = function(root) {
	var path = process.cwd() + '/';
	var htmlGlob = 'client/**/*.html'; 
	var cssGlob = 'client/**/*.css';

	var html = Q.defer();
	var css = Q.defer();

	function handler(defer) {
		return function(err, files) {
			if( err ) {
				console.log('failed! ', err);
				defer.reject();
			} else {
				var fileMap = files.map(function(filePath) {
					var newPath = filePath.replace(path + 'client', path + 'public');
					return copyFile(filePath, newPath);
				});

				Q.all(fileMap).then(defer.resolve);
			}
		};
	}

	glob(path + htmlGlob, handler(html));

	glob(path + cssGlob, handler(css));

	return Q.all([html.promise, css.promise]);
}

module.exports();