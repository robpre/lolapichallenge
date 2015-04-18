
function Progress() {

	this.rounds = [];

	this.preround = true;
}

Progress.prototype.start = function() {
	this.preround = false;
};

Progress.prototype.end = function() {
	
};

Progress.prototype.addRound = function(uid, d) {
	this.rounds.push({
		id: uid,
		data: d
	});
};

Progress.prototype.serialize = function() {
	return {
		finished: this.preround,
		rounds: this.rounds
	};
};

module.exports = Progress;