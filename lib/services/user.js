"use strict";
let v = require("sweets-valid");

let User = function(units) {
	this.ctrl = units.get("resources.user.controller");

	if(this.ctrl) {
		this.validator = units.require("resources.user.request").create();
	}
};

User.prototype.create = function(login, password, role, cb) {
	if(cb === undefined) {
		cb = role;
		role = undefined;
	}

	if(cb === undefined) {
		if(typeof password === "function") {
			password(new Error("Password not found"));
		} else {
			login(new Error("User id not found"));
		}
	}

	if(this.ctrl) {
		let newUser = {
			id: login,
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
				if(err) {
					if(err.code === 2) {
						cb(new Error("User exists"));
					} else {
						cb(err);
					}
				} else {
					cb(err, "Created user " + login);
				}
			});
		}
	} else {
		cb(new Error("No users' sweet"));
	}
};

module.exports = User;
