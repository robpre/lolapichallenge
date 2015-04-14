var MongoClient = require('mongodb').MongoClient;
var debug = require('debug')('urf:server:db');

// MongoClient.connect(MONGO_URL, function(err, db) {});

function DB(mongoURL) {
	this.mongoURL = mongoURL;
	return this;
}

DB.prototype.connect = function(cb) {
	debug('connecting to ' + this.mongoURL);
	if(!this.db) {
		var self = this;
		MongoClient.connect(this.mongoURL, function(err, db) {
			if(err) {
				debug(err);
				cb(err);
			} else {
				self.db = db;
				cb(null, db);
			}
		});
	} else {
		cb(null, this.db);
	}
};

DB.prototype.addUser = function(username, cb) {
	if(this.db) {
		this.db.collection('users')
			.insert({
				username: username
			}, function(err, userObj) {
				if(err || !userObj) {
					cb(err);
					return debug(err || 'failed creating user');
				}
				cb(null, userObj);
			});
	} else {
		debug('!!Error!! no db connection');
	}
};

DB.prototype.login = function(username, cb) {
	if(this.db) {
		var self = this;
		this.db.collection('users')
			.findOne({username: username}, function(err, userObj) {
				if(err || !userObj) {
					debug(err || 'creating user');
					return self.addUser(username, cb);
				}
				cb(null, userObj);
			});
	} else {
		debug('!!Error!! no db connection');
	}
};

module.exports = DB;