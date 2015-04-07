var Q = require('q');
var glob = require('glob');
var fs = require('fs');
var debug = require('debug')('urf:scripts:markup');

function copyFile(from, to, transform) {
	return Q.Promise(function(resolve, reject) {
		debug('Copying from', from, 'to', to);

		if( transform ) {
			fs.createReadStream(from)
				.pipe(transform)
					.pipe(fs.createWriteStream(to))
					.on('finish', resolve)
					.on('error', reject);
		} else {
			fs.createReadStream(from)
				.pipe(fs.createWriteStream(to))
				.on('finish', resolve)
				.on('error', reject);
		}
	});
}
// TODO: make this better
function transformPath(filePath, cwd) {
	return filePath.replace(cwd + 'client', cwd + 'public');
}
function que(fn) {
	var args = Array.prototype.slice(arguments, 1);
	return function() {
		return fn.apply(null, args);
	};
}

module.exports = function(path/*, globs*/) {
	var globs = ['client/**/*.html', 'client/**/*.css'];

	return Q.all(globs.map(function(pattern) {
		return Q.Promise(function(resolve, reject) {
			glob(pattern, function(err, files) {
				if( err ) {
					debug('Error indexing files', err);
					reject(err);
				} else {
					var filePromises = files.map(function(fileToCopy) {
						return que(copyFile, fileToCopy, transformPath(fileToCopy, path));
					});
					var first = filePromises.splice(1);

					filePromises.reduce(Q.when, first())
						.then(resolve)
						.catch(reject);
				}
			});
		});
	}));
};
