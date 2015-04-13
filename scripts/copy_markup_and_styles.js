var Q = require('q');
var glob = require('glob');
var path = require('path');
var debug = require('debug')('urf:scripts:markup');
var que = require('../lib/que');
var fs = require('fs');
var _ = require('lodash');

var sass = require('node-sass');
var Transform = require('stream').Transform;
function sassify(opts) {
	var sassTransform = new Transform();
	var cssString = '';
	sassTransform._transform = function(chunk, enc, next) {
		cssString += chunk.toString();
		next();
	};
	sassTransform._flush = function(next) {
		var self = this;
		sass.render(_.extend(opts, {
			data: cssString,
			success: function(result) {
				self.push(result.css);
				next();
			},
			error: function(err) {
				debug('couldn\'t sassify');
				debug(err);
			}
		}));
	};

	return sassTransform;
}

var magics = ['*', '?', '[', '!', '+', '@'];
function firstMagicCharIndex(string) {
	return magics.reduce(function(lastInd, curChar) {
		// if we already found a char then just close the loop
		return lastInd > -1 ? lastInd : string.indexOf(curChar);
	}, -1);
}

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

function reExt(file, ext) {
	if(ext) {
		return file.replace(new RegExp(path.extname(file) + '$'), ext);
	}
	return file;
}

function base(pathString) {
	return pathString.split(path.sep).pop() || '';
}

module.exports = function(basePath/*, globs*/) {
	// TODO: Taake these as arguments perhaps
	var globs = [{
		srcGlob: 'client/**/*.html',
		dest: 'public/'
	}, {
		srcGlob: 'client/**/*.scss',
		dest: 'public/',
		transform: function() {
			return sassify({
				sourceMapEmbed: process.env.NODE_ENV === 'development',
				outputStyle: 'compressed'
			});
		},
		ext: '.css'
	}, {
		srcGlob: 'node_modules/bootstrap/dist/css/bootstrap+(.min.css|.css.map)',
		dest: 'public/css/'
	}];
	var opts = {
		cwd: basePath
	};

	return Q.all(globs.map(function( pattern ) {
		return Q.Promise(function(resolve, reject) {
			var fullPathGlob = path.resolve(basePath, pattern.srcGlob);
			var fullPathDest = path.resolve(basePath, pattern.dest);

			// find files which match the globbing pattern provided
			glob(fullPathGlob, opts, function(err, files) {
				if( err ) {
					debug('Error matching files', err);
					reject(err);
				} else {
					var filePromises = files.map(function(fileToCopy) {
						// find out where the glob starts
						var globbingIndex = firstMagicCharIndex(fullPathGlob);

						if(globbingIndex > -1) {
							// get the destination
							var dest = fullPathDest.slice(0, globbingIndex);

							var globFile = base(fullPathGlob.slice(0, globbingIndex));

							// then join /root path/globfile/matched glob pattern/
							dest = path.join(dest, globFile + fileToCopy.slice(globbingIndex));
							// dest = /home/rob/websites/lolapichallenge/public/css/styles.scss
							return que(copyFile, fileToCopy, reExt(dest, pattern.ext), pattern.transform && pattern.transform());
						}
					});

					var first = filePromises.splice(0, 1)[0];
					if(first) {
						filePromises.reduce(Q.when, first())

							.then(resolve)
							.catch(reject);
					}
				}
			});
		});
	}));
};

if(!module.parent) {
	module.exports(process.cwd());
}
