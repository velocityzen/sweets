"use strict";
let async = require("neo-async");
let Forbidden = require("apis/lib/errors").Forbidden;
let Pwd = require("authen").Pwd;

let Controller = function () {
	this.db = null;
	this.auth = null;
	this.pwd = null;
};

Controller.prototype.box = "users";

Controller.prototype.unitInit = function (units) {
	this.db = units.require("db");
	this.auth = units.require("auth");

	let settings = units.require("core.settings");
	this.pwd = new Pwd(settings.passwordHash);
	this.roles = settings.roles;
};

Controller.prototype.createHash = function (password, cb) {
	this.pwd.hash(password, cb);
};

Controller.prototype.remove = function (id, password, cb) {
};

Controller.prototype.changePassword = function (id, password, newPassword, cb) {

};

Controller.prototype.restore = function (id, cb) {
};

Controller.prototype.loginInternal = function (id, password, cb) {
	let self = this, user;

	async.waterfall([
		function (cb) {
			self.db.r.table(self.box)
				.get(id)
				.run()
				.catch(cb)
				.then(function(res) {
					cb(null, res);
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
				let result = {id: user.id};

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
};

Controller.prototype.login = function (id, password, cb) {
	let self = this;
	this.loginInternal(id, password, function (err, user) {
		if(err) {
			cb(err);
		} else {
			if (user.id != null) {
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
