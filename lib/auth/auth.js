"use strict";
var inherits = require('util').inherits;
var SuperAuthUnit = require('apis/lib/auth/auth_unit');
var SweetsAuthProvider = require('./providers/sweets');

var AuthUnit = function () {
	SuperAuthUnit.call(this);
};
inherits(AuthUnit, SuperAuthUnit);

AuthUnit.prototype.unitIsInitRequired = true;

AuthUnit.prototype.getProviderClasses = function () {
	var providerClasses = AuthUnit.super_.prototype.getProviderClasses();
	providerClasses.sweets = SweetsAuthProvider;
	return providerClasses;
};


module.exports = AuthUnit;
