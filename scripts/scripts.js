var browserify = require('browserify');

module.exports = function(path) {
	var b = browserify();

	b.add('./client/js/main.js');

	return b.bundle();
};
