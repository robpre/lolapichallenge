module.exports = function(card, playerData) {
	// we an assume card.stats already exists
	card.stats.kills = playerData.stats.kills;
	return true;
};
