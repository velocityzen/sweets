"use strict";
let v = require("sweets-valid");

let User = function(units) {
	this.ctrl = units.get("resources.user.controller");

	if(this.ctrl) {
		this.validator = units.require("resources.user.request").create();
	}
};

User.prototype.create = function(email, password, role, cb) {
	if(cb === undefined) {
		cb = role;
		role = undefined;
	}

	if(this.ctrl) {
		let newUser = {
				email: email,
				password: password
		};

		if(role) {
			newUser.role = role;
		}

		let result = v.validate(newUser, v.validators.spec(this.validator), {stopOnFirstError: false, errors: {needMessage: true}});

		if (result.hasErrors()) {
			cb(result.errors);
		} else{
			this.ctrl.create(newUser, function(err) {
				cb(err, "Created user " + email);
			});
		}
	} else {
		cb("No users' sweet");
	}
};

module.exports = User;
