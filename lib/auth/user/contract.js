"use strict";
var inherits = require('util').inherits;
var apis = require('apis');
var valid = require('sweets-valid');
var v = valid.validators;

var handlers = apis.handlers;

var res = apis.resources.res;
var impl = handlers.impl;
var data = handlers.data;
var ret = handlers.ret;

var Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	var ctrl = units.require('controller');
	this.addItems([
		res('', {
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
