var browserify = require('browserify');

module.exports = function(root) {
	var path = root.replace(/[^\/]$/, function(str, match) {
		return match + '/';
	});
	var b = browserify();

	b.add('./client/js/main.js');

	return b.bundle();
};