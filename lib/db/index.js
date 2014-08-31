"use strict";
var Db = function (Sweet) {
	this.db = null;
	this.Sweet = Sweet;
};

Db.prototype.unitIsInitRequired = true;

Db.prototype.unitInit = function (units) {
	var settings  = units.require('core.settings').db;
	this.db = new this.Sweet(settings);
};

Db.prototype.unitGetInstance = function (unitInfo) {
	return this.db;
};


module.exports = Db;
