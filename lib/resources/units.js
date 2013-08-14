"use strict";
var UnitSet = require('units').UnitSet;

var User = require('./user/controller');

var create = function () {
	var units = new UnitSet();

	units.add('user',	new User());

	return units;
};


module.exports = {
	create: create
};
