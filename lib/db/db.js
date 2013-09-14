"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;
var Nougat = require('sweets-nougat').Nougat;

var Db = function () {
	this.settings = null;
	this.db = null;
};
inherits(Db, Unit);

Db.prototype.unitIsInitRequired = true;

Db.prototype.unitInit = function (units) {
	this.settings = units.require('core.settings').db;
	this.db = new Nougat(this.settings);
};

Db.prototype.unitGetInstance = function (unitInfo) {
	return this.db;
};


module.exports = Db;
