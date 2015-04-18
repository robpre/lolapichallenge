var _ = require('lodash');
var config = {
	size: 9
};

module.exports = [function() {
	var deck = [];
	for(var i = 0; i < config.size; i++) {
		deck[i] = null;
	}
	var returnSize = function() {
		return config.size;
	};
	var replaceCard = function(index, card) {
		if(index < returnSize()) {
			deck[index] = card;
			return true;
		}
		return false;
	};
	var toArray = function() {
		return _.chain(deck)
			.map(function(card) {
				return card && card._id;
			})
			.filter(_.identity)
			.value();
	};
	return {
		size: returnSize,
		replace: replaceCard,
		get: function() {
			return deck;
		},
		getArray: toArray
	};
}];
