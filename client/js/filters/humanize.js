var humanize = require('humanize-string');

module.exports = [function() {
	return function(input) {
		return humanize(input);
	};
}];