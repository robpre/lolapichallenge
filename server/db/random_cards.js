var debug = require('debug')('urf:server:db:random_cards');

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

module.exports = function(db, cardLen, callback) {
	var collection = db.collection('cards');
	var getLen = cardLen || 50;

	collection.count(function(err, count) {
		if(err) {
			callback(err);
			return debug('error counting cards', err);
		}
		var skip = getRandomArbitrary(0, count - getLen);

		var curser = collection.find({
			random: {
				$near: [Math.random(), Math.random()]
			}
		}, null, {
			skip: skip,
			limit: getLen
		});

		curser.toArray(function(err, data) {
			if(err) {
				callback(err);
				return debug('error reading cards', err);
			}
			callback(null, data);
		});

	});
};