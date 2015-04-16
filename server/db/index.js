var MongoClient = require('mongodb').MongoClient;
var debug = require('debug')('urf:server:db');
var SHA1 = require('crypto-js/sha1');
var _ = require('lodash');

var bankSampleCards = require('./bank/sample.js');

function sharify(str) {
	return SHA1(str).toString();
}

// MongoClient.connect(MONGO_URL, function(err, db) {});
function DB(mongoURL, salt) {
	this.mongoURL = mongoURL;
	this.passwordSalt = salt;
	return this;
}

DB.prototype.connect = function(cb) {
	debug('connecting to mongo');
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

DB.prototype.encryptPasssword = function(password) {
	return sharify(sharify(password) + this.passwordSalt);
};

DB.prototype.addUser = function(username, password, cb) {
	if(this.db) {
		var securePassword = this.encryptPasssword( password );
		this.db.collection('users')
			.insert({
				username: username,
				password: securePassword,
				cards: []
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

DB.prototype.auth = function(user, nonSecuredPassword) {
	return user.password === this.encryptPasssword(nonSecuredPassword);
};

DB.prototype.login = function(username, password, cb) {
	if(this.db) {
		var self = this;
		this.db.collection('users')
			.findOne({username: username}, function(err, userObj) {
				if(err) {
					debug('error fetching user!', err);
					return cb(err);
				}

				if(!userObj) {
					// no user yet, create one
					return self.addUser(username, password, function(err, userObj) {
						// let our consumer know it's a fresh user
						cb(err, userObj, true);
					});
				} else {
					if(!self.auth(userObj, password)) {
						return cb('password missmatch');
					} else {
						// success! found the user
						// pass false to the cb so we it knows it's not a fresh user
						return cb(null, _.omit(userObj, 'password'), false);
					}
				}
			});
	} else {
		debug('!!Error!! no db connection');
	}
};

DB.prototype.close = function() {
	debug('shutting down mongo connection');
	if(this.db) {
		this.db.close();
		this.db = null;
	}
};

module.exports = DB;