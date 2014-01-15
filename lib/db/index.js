"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;

var Db = function (DbSweet) {
	this.db = null;
	this.Sweet = DbSweet;
};
inherits(Db, Unit);

Db.prototype.unitIsInitRequired = true;

Db.prototype.unitInit = function (units) {
	var settings  = units.require('core.settings').db;
	this.db = new this.Sweet(settings);
};

Db.prototype.unitGetInstance = function (unitInfo) {
	return this.db;
};


module.exports = Db;
