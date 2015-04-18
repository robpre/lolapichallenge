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
		return state.map; 
	};
	var getAvailableCards = function() {
//		return state.states.player.availableDeck;
		return state.players.blue.deck;
	};
	var calculateCurrentTurn = function() {
		var turn = {};
		if(state.progress.preround) {
			turn.type = 'preround';
		} else {
			var latestRound = state.progress.rounds[state.progress.rounds.length-1];
			turn.type = 'round';
			turn.ours = state.yourTurn;
		}
		return turn;
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
		/* too tired now */
		get: function() {
			return state;
		},
		current: function() {
			return state;
		},
		cards: getAvailableCards,
		map: getMapState,
		round: calculateCurrentTurn,
		messages: getMessages
	};
}];
