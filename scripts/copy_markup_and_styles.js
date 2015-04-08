var Q = require('q');
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var debug = require('debug')('urf:scripts:markup');
var que = require('../lib/que');

function copyFile(from, to, transform) {
	return Q.Promise(function(resolve, reject) {
		debug('Copying from ' + from + ' to ' + to);

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
	var resolved = path.resolve(cwd, filePath);
	var reg = new RegExp(path.sep + 'client' + path.sep);
	return resolved.replace(reg, path.sep + 'public' + path.sep);
}

module.exports = function(basePath/*, globs*/) {
	var globs = ['client/**/*.html', 'client/**/*.css'];
	var opts = {
		cwd: basePath
	};

	return Q.all(globs.map(function(pattern) {
		return Q.Promise(function(resolve, reject) {
			glob(path.resolve(basePath, pattern), opts, function(err, files) {
				if( err ) {
					debug('Error matching files', err);
					reject(err);
				} else {
					var filePromises = files.map(function(fileToCopy) {
						return que(copyFile, fileToCopy, transformPath(fileToCopy, basePath));
					});
					var first = filePromises.splice(0, 1)[0];

					filePromises.reduce(Q.when, first())
						.then(resolve)
						.catch(reject);
				}
			});
		});
	}));
};

if( !module.parent ) {
	module.exports(process.cwd());
}
