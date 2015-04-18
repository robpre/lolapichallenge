var _ = require('lodash');
module.exports = ['$rootScope', function($rootScope) {
	var state = null;
	var loadState = function(data) {
		state = data;
		console.log('LOADING GAME STATE: ', state);
		if(state === null) {
			$rootScope.$broadcast('urfFind.found');
		} else { 
			$rootScope.$broadcast('urfState.updated');
		}
	};
	var getMapState = function() {
		//parse and format the state
		return {lol: 'some map fixture'}; 
	};
	var getAvailableCards = function() {
//		return state.states.player.availableDeck;
		return {lol: 'some card fixture'};
	};
	var calculateCurrentRound = function() {
		var round = {};
		if(!state.states.preround.completed) {
			round.type = 'preround';
		} else {
			var latestRound = state.states.rounds[state.states.rounds.length-1];
			round.type = 'round';
			round.number = latestRound.number;
			round.ours = (latestRound.player === 'blue' ? true : false);
		}
		return round;
	}; 

	var getMessages = function() {
		return {lol: 'some messages fixture'};
	};
	/*
	var checkFinished = function() {
		if(state.finished) {
			return true;
		}
		return false;
	};
	var getVictor = function() {
		if(checkFinished()) {
			return (state.finished.player === 'blue' ? true : false);
		}
		return false;
	}; */
	return {
		load: loadState,
/*		finished: checkFinished,
		victory: getVictor, */
		current: function() {
			return state;
		},
		deck: getAvailableCards,
		map: getMapState,
		round: calculateCurrentRound,
		messages: getMessages
	};
}];
