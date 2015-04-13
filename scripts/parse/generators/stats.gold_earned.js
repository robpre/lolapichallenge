module.exports = function(card, playerData) {
	// we an assume card.stats already exists
	card.stats.goldEarned = playerData.stats.goldEarned;
	return true;
};
