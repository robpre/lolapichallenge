var _ = require('lodash');

function Progress() {

	this.actions = [];

	this.preround = true;

	this.prerounded = {};
}

Progress.prototype.start = function() {
	this.preround = false;
};

Progress.prototype.endPreroundForUser = function(user) {
	this.prerounded[user] = true;
	if(_.size(this.prerounded) === 2) {
		this.preround = false;
		return true;
	}
};

Progress.prototype.addRound = function(username, d) {
	this.actions.push({
		owner: username,
		data: d
	});
};

Progress.prototype.serialize = function() {
	return {
		preround: this.preround,
		actions: this.actions
	};
};

module.exports = Progress;