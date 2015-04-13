var request = require('request');
var ENDPOINTS = require('../endpoints.js');
var _ = require('lodash');

var API_KEY = process.env.API_KEY;

var champDataToFetch = [
	// 'all',
	// the following are options we can select from
	'allytips',
	'altimages',
	'blurb',
	'enemytips',
	'image', // TODO: link into how images will be fetched: https://developer.riotgames.com/docs/static-data
	'info',
	'lore',
	'partype',
	'passive',
	// 'recommended',
	'skins',
	// 'spells',
	'stats',
	'tags'
];
var imageKeys = ['image', 'altimages', 'skins', 'altimages'];
module.exports = function(card, playerData, done) {

	var url = ENDPOINTS.get('champion', {
		api_key: API_KEY,
		champData: champDataToFetch.join(',')
	}, playerData.championId);
	request(url, function(err, response, champJson) {
		if(err || response.statusCode !== 200) {
			return done(err || champJson);
		}
		var champData = JSON.parse(champJson);
		card.champion = _.omit(champData, imageKeys);
		card.championImage = _.pick(champData, imageKeys);
		done();
	});
};
