// TODO:
module.exports = function(card, playerData) {
	card.type = playerData.matchData.queueType;
	return true;
};
