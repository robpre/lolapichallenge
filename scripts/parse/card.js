#!/usr/bin/env node
var JSONStream  = require('JSONStream');
var debug	= {
	general: 	require('debug')('urf:scripts:parse:card:general'),
};
var _ = require('lodash');
var requiredir = require('requiredir');
var imports = requiredir('./generators');

var card = function(base) {
	var module = (function() {
		var obj = {};
		var data = base;

		var merge = function(b) {
			_.merge(obj, b);
		};
		var format = function() {
			return JSON.stringify(obj);
		};
		var raw = function() {
			return data;
		};
		return {
			merge: merge,
			format: format,
			raw: raw
		};
	})();
	return module;
};

var finalCard = {
	shiny: true || false,
	rank: 'UNRANKED' || 'BRONZE' || 'SILVER' || 'GOLD' || 'PLATINUM' || 'DIAMOND',
	type: 'URF' || '5x5',
	name: '',
};

process.stdout.write('[');
process.stdin.pipe(JSONStream.parse('*', function(data) {
		var playerCard = card(data);
		debug.general('Preparing to loop through '+imports.length+' imports');
		_.each(imports, function(generator) {
			playerCard = generator(playerCard);
		});
		debug.general('Writing out card');
		process.stdout.write(playerCard.format() + ',');
}));
