"use strict";
var UnitSet = require('units').UnitSet;
var Contract = require('./contract');
var AuthUnit = require('./auth');
var userUnits = require('./user/units');

var create = function () {
	var units = new UnitSet();

	units.add('~', new AuthUnit());
	units.add('contract', new Contract());
	units.addSet('user', userUnits.create());

	return units;
};


module.exports = {
	create: create
};
