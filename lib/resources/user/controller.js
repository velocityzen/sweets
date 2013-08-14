"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;

var User = function () {
	this.db = null;
};
inherits(User, Unit);

User.prototype.unitInit = function (units) {
	this.authPersonLogic = units.require('auth.person.logic');
	//db connection
	//this.db = units.require('db').collection('users');
};

User.prototype.get = function(username, scope, cb) {
	if(!scope) {
		scope = {};
	}
	scope.auth = false;
	this.db.findById(username, scope, cb);
};


User.prototype.add = function (userData, cb) {
	var self = this;

	async.waterfall([
		function(cb) {
			if(userData.password) {
				self.authPersonLogic.createHash(userData.password, cb);
			} else {
				cb();
			}
		},

		function(passwordHash, cb) {
			var auth = {};

			if(passwordHash) {
				auth = {
					password: passwordHash,
					created:  Date.now()
				};
			} else {
				auth = userData.auth;
			}

/*			self.db.insert( {
				_id: userData.username,
				email: userData.email,
				displayName: userData.displayName || '',
				created:  Date.now(),
				auth: auth
			}, {safe: true},
			cb);*/
		},
	], cb);

};

User.prototype.update = function (username, to, cb) {
/*	this.db.update(
		{ _id: username },
		{ $set: to },
		{ safe:true },
		cb
	);*/
};

User.prototype.updatePassword = function (username, newPassword, cb) {
	var self = this;

	async.waterfall([
		function(cb) {
			self.authPersonLogic.createHash(newPassword, cb);
		},

		function(passwordHash, cb) {
/*			self.db.update(
				{ _id: username },
				{ $set: { 'auth': {
					password: passwordHash,
					created:  Date.now()
				}}},
				{safe: true},
				cb
			);*/
		},

	], cb);
};

User.prototype.remove = function (username, cb) {
	async.waterfall([
		function(cb) {
			//this.db.removeById(username, {safe:true}, cb);
		},

		function(result, cb) {
			//cleanup
			cb(result);
		}

	], cb);
};


module.exports = User;
