"use strict";
var UnitSet = require('units').UnitSet;
var Contract = require('./contract');
var Controller = require('./controller');

var create = function () {
	var units = new UnitSet();

	units.add('contract', new Contract());
	units.add('controller', new Controller());

	return units;
};


module.exports = {
	create: create
};
