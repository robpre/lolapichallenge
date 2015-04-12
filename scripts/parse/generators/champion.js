var request = require('request');
var ENDPOINTS = require('../endpoints.js');

var API_KEY = process.env.API_KEY;

var champDataToFetch = [
	'all',
	// the following are options we can select from
	// 'allytips',
	// 'altimages',
	// 'blurb',
	// 'enemytips',
	// 'image', // TODO: link into how images will be fetched: https://developer.riotgames.com/docs/static-data
	// 'info',
	// 'lore',
	// 'partype',
	// 'passive',
	// 'recommended',
	// 'skins',
	// 'spells',
	// 'stats',
	// 'tags'
];
module.exports = function(card, stats, done) {
	var url = ENDPOINTS.get('champion', {
		api_key: API_KEY,
		champData: champDataToFetch.join(',')
	}, stats.championId);
	request(url, function(err, response, champData) {
		if(err || response.statusCode !== 200) {
			return done(err || champData);
		}
		card.champion = JSON.parse(champData);
		done();
	});
};
