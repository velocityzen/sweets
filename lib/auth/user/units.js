"use strict";
let UnitSet = require("units").UnitSet;
let Contract = require("./contract");
let Controller = require("./controller");

module.exports = function () {
	let units = new UnitSet();

	units.add("contract", new Contract());
	units.add("controller", new Controller());

	return units;
};
