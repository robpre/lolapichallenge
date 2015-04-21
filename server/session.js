var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);

module.exports = function(db, secret) {
	var store = new MongoStore({ db: db });
	return {
		store: store,
		cookieParser: cookieParser(secret),
		expressSession: expressSession({
			secret: secret,
			store: store,
			resave: true,
			saveUninitialized: false
		})
	};
};