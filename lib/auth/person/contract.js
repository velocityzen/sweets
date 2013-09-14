"use strict";
var inherits = require('util').inherits;
var apis = require('apis');
var valid = require('valid');

var handlers = apis.handlers;

var res = apis.resources.res;
var impl = handlers.impl;
var data = handlers.data;
var ret = handlers.ret;

var validators = valid.validators;
var str = validators.str;


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
					email: str,
					password: str
				}),
				ret.any,
					impl(function (ctx) {
						ctrl.login(ctx.data.email, ctx.data.password, ctx.cb);
					})
			]})
	]);
};


module.exports = Contract;
