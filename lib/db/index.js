"use strict";
let Db = function (Sweet) {
	this.instance = null;
	this.Sweet = Sweet;
};

Db.prototype.unitIsInitRequired = true;

Db.prototype.unitInit = function (units) {
	let options = units.require("core.settings").db.options;
	this.instance = new this.Sweet(options);
};

Db.prototype.unitGetInstance = function (unitInfo) {
	return this.instance;
};


module.exports = Db;
