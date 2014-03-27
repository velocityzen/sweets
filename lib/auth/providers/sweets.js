"use strict";
var inherits = require('util').inherits;
var AuthProvider = require('authen/lib/auth_provider');

var SweetsAuthProvider = function (opt_options) {
	AuthProvider.call(this, opt_options);
};
inherits(SweetsAuthProvider, AuthProvider);

SweetsAuthProvider.prototype.packIdentity = function (identity) {
	if(identity.role === undefined) {
		return identity.id;
	} else {
		return identity.role+ ":" + identity.id;
	}
};

SweetsAuthProvider.prototype.unpackIdentity = function (identityStr) {
	var parsed = identityStr.split(":");

	if(parsed.length > 1) {
		return {
			role: parseInt(parsed[0], 10),
			id: parsed[1]
		};
	} else {
		return {id:identityStr};
	}
};


module.exports = SweetsAuthProvider;
