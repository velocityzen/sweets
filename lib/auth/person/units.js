"use strict";
var UnitSet = require('units').UnitSet;
var Contract = require('./contract');
var Logic = require('./logic');


var create = function () {
	var units = new UnitSet();

	units.add('contract', new Contract());
	units.add('logic', new Logic());

	return units;
};


module.exports = {
	create: create
};
