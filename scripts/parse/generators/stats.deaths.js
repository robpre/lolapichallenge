module.exports = function(card, playerData) {
	// we an assume card.stats already exists
	card.stats.deaths = playerData.stats.deaths;
	return true;
};
