"use strict";
//var errh = require('ncbt').errh;
var Forbidden = require('apis/lib/errors').Forbidden;
var Pwd = require('authen').Pwd;

var Logic = function () {
	this.db = null;
	this.auth = null;
	this.pwd = null;
};

Logic.prototype.unitInit = function (units) {
	this.db = units.require('db');
	this.auth = units.require('auth');

	var settings = units.require('core.settings');
	this.pwd = new Pwd(settings.passwordHash);
};

Logic.prototype.createHash = function (password, cb) {
	this.pwd.hash(password, cb);
};

Logic.prototype.remove = function (username, password, cb) {
};

Logic.prototype.changePassword = function (username, password, newPassword, cb) {

};

Logic.prototype.restore = function (username, cb) {
};

Logic.prototype.loginInternal = function (username, password, cb) {
	var self = this;

	//login and db logic here ex.:
/*	async.waterfall([
		function (cb) {
			//self.db.collection('users').findById(username, {auth: true}, cb);
		},
		function (userData, cb) {
			if (!userData) {
				cb(new Forbidden());
			}
			else {
				self.pwd.verify(password, userData.auth.password, cb);
			}
		},
		function (isMatch, cb) {
			if (isMatch) {
				cb(null, username);
			}
			else {
				cb(new Forbidden());
			}
		}
	], cb);*/
};

Logic.prototype.login = function (username, password, cb) {
	var self = this;
	/*this.loginInternal(username, password, errh(function (username, cb) {
		if (username != null) {
			self.auth.providers.user.login(null, username, null, errh(function (result, cb) {
				cb(null, result.result);
			}, cb));
		}
		else {
			cb();
		}
	}, cb));*/
};


module.exports = Logic;
