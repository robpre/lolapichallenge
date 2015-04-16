var config = require('../config/deck.json');
var _ = require('lodash');
module.exports = [function() {
	var deck = [];
	for(var i = 0; i<config.size; i++) {
		deck[i] = null;
	}
	var returnSize = function() {
		return config.size;
	};
	/*
	 we are not going to implement saving of decks,to save time, each time we will reload a blank deck to play with 
	var saveDeck = function() {
		//promise
		//return promise.promise;
	};

	var lazySave = function() {
		_.debounce(saveDeck, 5000);
	}; */
	var replaceCard = function(index, card) {
		if(index < returnSize()) {
			deck[index] = card;
//			lazySave();
			return true;
		}
		return false;
	};
	/*
	var swapCards = function(a, b) {
		var index = _.findKey(deck, a);
		if(index>0) {
			return replaceCard(index, b);
		}
		return false;
	}; */

	return {
		size: returnSize,
		replace: replaceCard,
//		swap: swapCards,
//		save: saveDeck,
		get: function() {
			return deck;
		}
	};
}];
