
function turret() {
	return {
		defending: null,
		status: true
	};
}

function freshTurrets() {
	return {
		top: turret(),
		middle: turret(),
		bottom: turret()
	};
}

function GameMap() {
	this.map = {
		nexus: {
			status: true
		},
		turrets: {
			inhibitor: freshTurrets(),
			inner: freshTurrets(),
			outer: freshTurrets()
		}
	};

	return this;
}

var levels = ['inhibitor', 'inner', 'outer'];

GameMap.prototype.open = function(location, lane) {
	var next = levels.indexOf(location) + 1;
	// if next most vulnerable is falsey then its outer
	if(!next) {
		return true;
	}
	return !this.map.turrests[next][lane].status;
};

GameMap.prototype.cardLess = function() {
	var output = {
		nexus: this.map.nexus.status,
		turrets: {

		}
	};
	var map = this.map;
	['inhibitor', 'inner', 'outer'].forEach(function(location) {
		['top', 'middle', 'bottom'].forEach(function(lane) {
			var t = {};
			t[lane] = {
				stutus: map.turrets[location][lane].status
			};
			output.turrets[location] = t;
		});
	});
	return output;
};

// GameMap.prototype.openTurrets = function() {
// 	['inhibitor', 'inner', 'outer'].forEach(function(location) {
// 		['top', 'middle', 'bottom'].forEach(function(lane) {

// 		});
// 	});
// };

GameMap.prototype.defend = function(location, lane, card) {
	this.map.turrets[location][lane].defending = card;
};

GameMap.prototype.destroy = function(location, lane) {
	this.map.turrets[location][lane].status = false;
};

GameMap.prototype.serialize = function() {
	return this.map;
};

module.exports = GameMap;