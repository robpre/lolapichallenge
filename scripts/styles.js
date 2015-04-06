var Q = require('q');
var sass = require('node-sass');

module.exports = function(root) {
	var path = root.replace(/[^\/]$/, function(str, match) {
		return match + '/';
	});
	var styles = Q.defer();

	sass.render({
		file: path + '/client/css/styles.sass',
		success: styles.resolve,
		error: styles.reject,
		outputStyle: 'compressed'
	});

	return styles;
}