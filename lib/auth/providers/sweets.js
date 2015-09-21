"use strict";
let inherits = require("util").inherits;
let AuthProvider = require("authen/lib/auth_provider");

let SweetsAuthProvider = function (opt_options) {
	AuthProvider.call(this, opt_options);
};
inherits(SweetsAuthProvider, AuthProvider);

SweetsAuthProvider.prototype.packIdentity = function (identity) {
	return identity.id;
};

SweetsAuthProvider.prototype.unpackIdentity = function (identityStr) {
	return {id:identityStr};
};


module.exports = SweetsAuthProvider;
