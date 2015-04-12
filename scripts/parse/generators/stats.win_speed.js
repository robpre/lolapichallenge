module.exports = function(card, playerData) {
	// we an assume card.stats already exists
	card.stats.winSpeed = playerData.stats.winner ? playerData.matchData.matchDuration : -1;
	return true;
};
