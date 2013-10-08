"use strict";
var async = require('async');
var Forbidden = require('apis/lib/errors').Forbidden;
var Pwd = require('authen').Pwd;

var Controller = function () {
	this.db = null;
	this.auth = null;
	this.pwd = null;
};

Controller.prototype.unitInit = function (units) {
	this.db = units.require('db');
	this.box = this.db.getBox('users');
	this.auth = units.require('auth');

	var settings = units.require('core.settings');
	this.pwd = new Pwd(settings.passwordHash);
	this.roles = settings.roles;
};

Controller.prototype.createHash = function (password, cb) {
	this.pwd.hash(password, cb);
};

Controller.prototype.remove = function (email, password, cb) {
};

Controller.prototype.changePassword = function (email, password, newPassword, cb) {

};

Controller.prototype.restore = function (email, cb) {
};

Controller.prototype.loginInternal = function (email, password, cb) {
	var self = this, user;

	this.db.getConnection(function(conn) {
		async.waterfall([
			function (cb) {
				self.box.get(email).run(conn, function(err, result) {
					cb(err, result);
					self.db.releaseConnection(conn);
				});
			},
			function (userData, cb) {
				if (!userData) {
					cb(new Forbidden());
				}
				else {
					user = userData;
					self.pwd.verify(password, userData.auth.password, cb);
				}
			},
			function (isMatch, cb) {
				if (isMatch) {
					var result = {email: user.email};

					if(user.role && self.roles) {
						result.role = self.roles.indexOf(user.role);
					}

					cb(null, result);
				}
				else {
					cb(new Forbidden());
				}
			}
		], cb);
	}, cb);
};

Controller.prototype.login = function (email, password, cb) {
	var self = this;
	this.loginInternal(email, password, function (err, user) {
		if(err) {
			cb(err);
		} else {
			if (user.email != null) {
				self.auth.providers.sweets.login(null, user, null, function (err, result) {
					if(err) {
						cb(err);
					} else {
						cb(null, result.result);
					}
				});
			}
			else {
				cb();
			}
		}
	});
};


module.exports = Controller;
