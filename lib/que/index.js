module.exports = function que(fn) {
	var args = Array.prototype.slice.call(arguments, 1);
	return function() {
		return fn.apply(null, args);
	};
};