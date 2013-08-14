"use strict";
var inherits = require('util').inherits;
var apis = require('apis');
var valid = require('valid');

var handlers = apis.handlers;

var res = apis.resources.res;
var impls = handlers.impls;
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
	var logic = units.require('logic');
	this.addItems([
		res('', {
			call: [
				data({
					username: str,
					password: str
				}),
				ret.any,
					impl(function (ctx) {
						logic.login(ctx.data.username.toLowerCase(), ctx.data.password, ctx.cb);
					})
			]})
	]);
};


module.exports = Contract;
