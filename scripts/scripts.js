var browserify = require('browserify');

module.exports = function(path) {
	var b = browserify({
		debug: process.env.NODE_ENV === 'development'
	});

	b.add('./client/js/main.js');

	return b.bundle();
};
