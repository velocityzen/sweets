"use strict";
var inherits = require('util').inherits;
var AuthProvider = require('authen/lib/auth_provider');

var SweetsAuthProvider = function (opt_options) {
	AuthProvider.call(this, opt_options);
};
inherits(SweetsAuthProvider, AuthProvider);

SweetsAuthProvider.prototype.packIdentity = function (identity) {
	return identity.role+ ":" + identity.email;
};

SweetsAuthProvider.prototype.unpackIdentity = function (identityStr) {
	var parsed = identityStr.split(":");
	return {
		role: parseInt(parsed[0], 10),
		email: parsed[1]
	};
};


module.exports = SweetsAuthProvider;
