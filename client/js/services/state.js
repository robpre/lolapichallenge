module.exports = [function() {
	var state = null;
	var loadState = function(data) {
		state = data;
		console.log('LOADING GAME STATE: ', state);
	};
	return {
		load: loadState,
		get: function() {
			return state;
		}
	};
}];
