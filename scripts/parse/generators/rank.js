// 
module.exports = function(card, stats) {
	card.rank = stats.highestAchievedSeasonTier;
	return true;
};
