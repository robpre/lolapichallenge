var format = require('util').format;
var qs = require('querystring');
var _ = require('lodash');

function buildUrl(url, args) {
	return url + '?' + qs.stringify(args);
}
module.exports = (function() {
	var config = {
		urf: 'https://euw.api.pvp.net/api/lol/euw/v4.1/game/ids',
		match: 'https://euw.api.pvp.net/api/lol/euw/v2.2/match/%s',
		champion: 'https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/%s'
	};
	return {
		get: function(endpoint, query) {
			var replacements = _.toArray(arguments).slice(2);
			var base = config[endpoint];
			var formatted = format.apply(null, [base].concat(replacements));
			return buildUrl(formatted, query);
		}
	};
})();