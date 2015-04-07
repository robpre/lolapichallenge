var express = require('express');
var request = require('request');
var debug = require('debug')('urf:server:index');
var qs = require('querystring');

module.exports = function(apiKey) {
	var api = express();
	
	api.get('/urf/retrieve-games', function(req, res) {
		var requestUrl = 'https://euw.api.pvp.net/api/lol/euw/v4.1/game/ids?' + qs.stringify({
				beginDate: (new Date('2015-04-06T12:00')).getTime()/1000,
				api_key: apiKey
		});

		debug('Doing request with ' + apiKey);
		debug(requestUrl);

		request({
			url: requestUrl
		}).pipe(res);
	});

	api.get('/urf/find-game/:matchId', function(req, res) {
		var matchId = req.params.matchId;
		var requestUrl = 'https://euw.api.pvp.net/api/lol/euw/v2.2/match/' + matchId + '?' + qs.stringify({
				includeTimeline: true,	
				api_key: apiKey
		});

		debug('Doing request with ' + apiKey);
		debug('Retrieving match ' + matchId);
		debug(requestUrl);

		request({
			url: requestUrl
		})
		.pipe(res);
	});

	return api;
};
