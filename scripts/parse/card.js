#!/usr/bin/env node
var JSONStream  = require('JSONStream');
var debug	= {
	general: 	require('debug')('urf:scripts:parse:card:general'),
};
var Q = require('q');
var requiredir = require('requiredir');

// generators
var imports = requiredir('./generators');

var card = function(base) {
	var module = (function() {
		var obj = {};
		var data = base;

		var format = function() {
			return JSON.stringify(obj, null, '\t');
		};
		var raw = function() {
			return data;
		};
		var applyGenerator = function(generator, name) {
			debug.general('applying generator ' + name);
			return Q.Promise(function(resolve, reject) {
				// 
				var sync = generator(obj, raw(), function(err) {
					return err ? reject(err) : resolve();
				});
				if(sync) {
					resolve();
				}
			});
		};
		return {
			format: format,
			raw: raw,
			applyGenerator: applyGenerator
		};
	})();
	return module;
};

// stored in mongo
// jshint ignore:start
var statsCollection = {
	key: '+' || '-',
};

var finalCard = {
	shiny: true || false,
	rank: 'UNRANKED' || 'BRONZE' || 'SILVER' || 'GOLD' || 'PLATINUM' || 'DIAMOND',
	type: 'URF' || '5x5',
	champion: 'Alister',
	stats: {
		kills: 17,
		deaths: 18
	}
};
// jshint ignore:end

process.stdout.write('[');
process.stdin.pipe(JSONStream.parse('*', function(data) {
		var playerCard = card(data);
		debug.general('Preparing to loop through '+imports.length+' imports');

		var genPromises = imports.toArray().map(playerCard.applyGenerator);
		// imports exposes a toArray method
		Q.all(genPromises)
			.then(function() {
				debug.general('Writing out card');
				process.stdout.write(playerCard.format() + ',');
			})
			.catch(function(err) {
				console.error('error parsing card!', err);
			});
}));
