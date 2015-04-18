
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
}

GameMap.prototype.openTurrets = function() {
	['inhibitor', 'inner', 'outer'].forEach(function() {
		
	});
};

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