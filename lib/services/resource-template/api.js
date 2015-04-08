"use strict";
let returnHandler = require("apis-return").handler;

let Api = function () {};

Api.prototype.resource = "%resource%";

Api.prototype.unitInit = function (units) {
	this.ctrl = units.require("resources.%name%.controller");
};

Api.prototype.get = function (auth, data, cb) {
	this.ctrl.get(data.id, returnHandler("NotFound", cb));
};

Api.prototype.create = function (auth, data, cb) {
	this.ctrl.create(data, returnHandler("BadRequest", cb));
};

Api.prototype.update = function (auth, data, cb) {
	this.ctrl.update(data.id, data.to, returnHandler("BadRequest", cb));
};

Api.prototype.del = function (auth, data, cb) {
	this.ctrl.remove(data.id, returnHandler("NotFound", cb));
};


module.exports = Api;
