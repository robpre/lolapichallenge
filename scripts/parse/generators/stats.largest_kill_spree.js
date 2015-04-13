module.exports = function(card, playerData) {
	// we an assume card.stats already exists
	card.stats.largestKillingSpree = playerData.stats.largestKillingSpree;
	return true;
};
