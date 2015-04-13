var express = require('express');
var request = require('request');
var debug = require('debug')('urf:server:index');
var qs = require('querystring');

module.exports = function(apiKey) {
	var api = express();

	return api;
};
