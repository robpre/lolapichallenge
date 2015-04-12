#!/usr/bin/env node
var request 	= require('request');
var debug	= {
	general: 	require('debug')('urf:scripts:parse:api:general'),
	games: 		require('debug')('urf:scripts:parse:api:games'),
	stats:		require('debug')('urf:scripts:parse:api:stats'),
	queue:		require('debug')('urf:scripts:parse:api:queue'),
	info:		require('debug')('urf:scripts:parse:api:info'),
};
var _ 			= require('lodash');
var Q 			= require('q');
var moment  	= require('moment');
var JSONStream  = require('JSONStream');
var argv 		= require('yargs').argv;
var Bottleneck 	= require('bottleneck');
var ENDPOINTS   = require('./endpoints.js');

var lolApi = function(config) {
	var api = (function() {
		var config = {}, limiter;
		// bronze league date handling function
		var rootDate = function(dateString, root) {
			var max = 'T23:59:59';
			var min = 'T00:00:00';
			var result;
			if(root) { 
				result = dateString + min;
				debug.general('Rooting '+dateString+' -> '+result);
			} else {
				result = dateString + max;
				debug.general('Buffing '+dateString+' -> '+result);
			}
			return result;
		};
		//built this little thing to pass to the limiter slowly
		//this is so we can inject card requests into the front of the queu
		var requestQueue = (function() {
			var queue = [];
			var started = false;
			var start = function() {
				debug.queue('Starting controlling queue');
				started = setInterval(action, 1000);
			};
			var stop = function() {
				if(started !== false) {
					debug.queue('Stopping controlling queue');
					clearInterval(started);
				}
				started = false;
			};

			var add = function(job) {
				debug.queue('Adding job to queue');
				queue.push(job);
			};

			var force = function(job) {
				debug.queue('Forcing job on queue');
				queue.unshift(job);
			};

			var action = function() {
				if(started) { 
					var job = queue.shift();
					if(typeof job !== 'undefined') {
						debug.queue('Running queue job');
						job();
					}
				}
			};

			return {
				start: start,
				stop: stop,
				add: add,
				force: force
			};
		})();
		var setup = function(options) {
			options = options || {};	
			config = _.merge(config, options);

			if(typeof config.start === undefined) {
				throw new Error('Start parameter is undefined');
			}
			if(typeof config.finish === undefined) {
				throw new Error('Finish parameter is undefined');
			}

			//NOTE convert to unix timestamp
			config.start = parseInt(moment(rootDate(config.start, true)).format('X'));
			debug.general('Converted start to: '+config.start);
			config.finish = parseInt(moment(rootDate(config.finish, false)).format('X'));
			debug.general('Converted finish to: '+config.finish);
			limiter = new Bottleneck(1, 1000);
		};
		var streamUrfGames = function(timestamp, operator, callback) {
			var requestConfig = {
				url: ENDPOINTS.get('urf', { beginDate: timestamp, api_key: config.apiKey })
			};
			debug.games('Retrieving t:'+timestamp+' via '+JSON.stringify(requestConfig));
			return operator(request(requestConfig).on('end', callback));
		};
		var streamGameStats = function(match, operator, callback) {
			debug.stats('Getting stats for match: '+match);
			var requestConfig = {
				url: ENDPOINTS.get('match', { includeTimeline: false, api_key: config.apiKey }, match.toString())
			};
			debug.stats('Retrieving m:'+match+' via '+JSON.stringify(requestConfig));
			return operator(request(requestConfig).on('end', callback));
		};

		var buildInterval = function() {
			var stamps = [];
			var jump = (60*5); //
			var start = config.start;
			stamps.push(start);
			do {
				start = start + jump;
				stamps.push(start);
			} while ( start < config.finish );

			debug.general('Collected intervals: '+JSON.stringify(stamps, null, 1));
			return stamps;
		};
		var handleGameObj = function(match) {
			var matchStats = _.omit(match, 'participants', 'teams');
			var teamData = _.indexBy(match.teams, 'teamId');
			var players = match.participants;
			debug.stats('Picked up participants block length: '+players.length);
			_.each(players, function(stats) {
				//each stat is now pumped out to STDOUT where it will be handled by subsequent processing scripts
				stats.matchData = matchStats;
				stats.teams = teamData;
				process.stdout.write(JSON.stringify(stats) + ',');
			});
		};

		var findStats = function() {
			// build intervals of 5 minutes
			var interval = buildInterval();
			var processStats = {
				games: 0,
				stats: 0
			};
			var promiseList = [];

			process.stdout.write('[');
			//loop through each interval
			_.each(interval, function(time) {
				//set up a promise for when each game has completed streaming
				var gamePromise = Q.defer();
				//send the limiter a stream function with a time parameter, stream processing function and a completion callback
				requestQueue.add(function() { 
					limiter.submit(streamUrfGames, time, function(stream) {
						//this function wraps the request (stream)
						//here we are chunking up the stream into JSON
						stream.pipe(JSONStream.parse('*', function(id) {
							debug.games('Picked up id: '+id);
							//each id is now used to retrieve game stats	
							//set up a promise for when each stat has completed streaming
							var statPromise = Q.defer();
							//send the limiter a stream function with an id parameter, stream processing function and a completion callback
							requestQueue.force(function() {
								limiter.submit(streamGameStats, id, function(statStream) {
									//this function wraps the request (stream)
									//here we are chunking up the stream into JSON
									var obj = {};
									statStream
										// we are essentially using json stream to validate the input
										.pipe(JSONStream.parse('*', function(data, keyArr) {
											var key = keyArr[0];
											obj[key] = data;
										})).on('end', function() {
											handleGameObj(obj);
											debug.info('Completed '+processStats.games+' games, '+ processStats.stats++ +' stats');
										});
								}, function() {
									//promise complete	
									statPromise.resolve();
								});
							});
							processStats.games++;
							debug.info('Completed '+processStats.games+' games, '+processStats.stats+' stats');
							promiseList.push(statPromise.promise);
							return null;
						}));
					}, function() {
						//promise complete	
						gamePromise.resolve(Q.delay(5000));
					});
				});
				promiseList.push(gamePromise.promise);
			});

			requestQueue.start();
			Q.allSettled(promiseList).then(function() {
				process.stdout.write(']');
				debug.info('Completed all ' + interval.length + ' available intervals');
				requestQueue.stop();
			});
		};

		return {
			stats: findStats,
			setup: setup
		};
	})();

	api.setup(config);
	return api;
};

debug.general('Parse argument start: ' +argv.start);
debug.general('Parse argument finish: ' +argv.finish);

var api = lolApi({
	apiKey: process.env.API_KEY,
	start: argv.start,
	finish: argv.finish
});
api.stats();
