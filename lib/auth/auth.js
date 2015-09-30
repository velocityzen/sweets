'use strict';
let inherits = require('util').inherits;
let SuperAuthUnit = require('apis/lib/auth/auth_unit');
let SweetsAuthProvider = require('./providers/sweets');

let AuthUnit = function() {
  SuperAuthUnit.call(this);
};
inherits(AuthUnit, SuperAuthUnit);

AuthUnit.prototype.unitIsInitRequired = true;

AuthUnit.prototype.getProviderClasses = function() {
  let providerClasses = AuthUnit.super_.prototype.getProviderClasses();
  providerClasses.sweets = SweetsAuthProvider;
  return providerClasses;
};


module.exports = AuthUnit;
