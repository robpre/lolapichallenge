// TODO: come up with a cleverer way
module.exports = function(card) {
	card.shiny = Math.random() < 0.01;
	return true;
};
