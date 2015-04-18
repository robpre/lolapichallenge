var _ = require('lodash');

function Progress() {

	this.rounds = [];

	this.preround = true;

	this.prerounded = {};
}

Progress.prototype.start = function() {
	this.preround = false;
};

Progress.prototype.endRoundForUser = function(user) {
	this.prerounded[user] = true;
	if(_.size(this.prerounded) === 2) {
		this.preround = false;
		return true;
	}
};

Progress.prototype.addRound = function(username, d) {
	this.rounds.push({
		id: username,
		data: d
	});
};

Progress.prototype.serialize = function() {
	return {
		preround: this.preround,
		rounds: this.rounds
	};
};

module.exports = Progress;