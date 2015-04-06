var express = require('express');
var request = require('request');
var debug = require('debug')('urf:server:index');
var qs = require('querystring');

module.exports = function(apiKey) {
	var api = express();
	
	/*api.get('/*', function(res, req/*) {
		request(sameUr )
	});*/
	api.get('/urf', function(req, res) {
		debug('doing request with ' + apiKey);
		debug('https://euw.api.pvp.net/api/lol/euw/v4.1/game/ids?' + qs.stringify({
				beginDate: (new Date('2015-04-06T12:00')).getTime()/1000,
				api_key: apiKey
			}));
		request({
			url: 'https://euw.api.pvp.net/api/lol/euw/v4.1/game/ids?' + qs.stringify({
				beginDate: (new Date('2015-04-06T12:00')).getTime()/1000,
				api_key: apiKey
			})
		}).pipe(res);
	});

	return api;
};