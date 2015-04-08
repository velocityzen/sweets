"use strict";
let Db = function (instance) {
	this.instance = instance;
};

Db.prototype.unitIsInitRequired = true;

Db.prototype.unitInit = function (units) {};

Db.prototype.unitGetInstance = function (unitInfo) {
	return this.instance;
};


module.exports = Db;
