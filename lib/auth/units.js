"use strict";
let UnitSet = require("units").UnitSet;
let Contract = require("./contract");
let Auth = require("./auth");
let user = require("./user/units");

module.exports = function () {
	let units = new UnitSet();

	units.add("~", new Auth());
	units.add("contract", new Contract());
	units.addSet("user", user());

	return units;
};
