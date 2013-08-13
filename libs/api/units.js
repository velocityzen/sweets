"use strict";
var UnitSet = require('units').UnitSet;
var Contract = require('./contract');
var User = require('./user');

var create = function () {
	var units = new UnitSet();

	units.add('contract', new Contract());
	units.add('user', new User());
	return units;
};


module.exports = {
	create: create
};
