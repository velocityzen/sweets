"use strict";
var UnitSet = require('units').UnitSet;
var Contract = require('./contract');
var AuthUnit = require('./auth');
var personUnits = require('./person/units');


var create = function () {
	var units = new UnitSet();

	units.add('~', new AuthUnit());
	units.add('contract', new Contract());
	units.addSet('person', personUnits.create());

	return units;
};


module.exports = {
	create: create
};
