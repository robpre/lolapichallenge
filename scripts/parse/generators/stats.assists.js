module.exports = function(card, playerData) {
	// we an assume card.stats already exists
	card.stats.assists = playerData.stats.assists;
	return true;
};
