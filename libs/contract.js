"use strict";
var inherits = require('util').inherits;
var path = require('path');

var apis = require('apis');
var resource = apis.resources.res;
var handlers = apis.handlers;
var contract = handlers.cont;
var data = handlers.data;
var impls = handlers.impls;
var ret = handlers.ret;
var st = handlers.st;

var Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	var authContract = units.require('auth.contract');
	var apiContract = units.require('api.contract');

	this.isMain = true;
	this.addItems([
		contract('/test',	[apis.testPage.contract]),
		contract('/auth',	[authContract]),
		contract('/api/1',	[apiContract]),
		resource.subpaths('/static', st(path.join(__dirname, '../static')))

		//views
	]);
};


module.exports = Contract;
