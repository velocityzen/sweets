"use strict";
let inherits = require("util").inherits;
let apis = require("apis");
let valid = require("sweets-valid");
let v = valid.validators;

let handlers = apis.handlers;

let res = apis.resources.res;
let impl = handlers.impl;
let data = handlers.data;
let ret = handlers.ret;

let Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	let ctrl = units.require("controller");
	this.addItems([
		res("", {
			call: [
				data({
					id: v.str,
					password: v.str
				}),
				ret.any,
					impl(function (ctx) {
						ctrl.login(ctx.data.id, ctx.data.password, ctx.cb);
					})
			]})
	]);
};


module.exports = Contract;
