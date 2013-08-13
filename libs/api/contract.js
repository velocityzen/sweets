"use strict";
var inherits = require('util').inherits;
var path = require('path');
var addResources = require('apis-addresources');

var apis = require('apis');
var resource = apis.resources.res;
var handlers = apis.handlers;
var st = handlers.st;

var Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	var auth =	units.require('auth').handler;
	var user =	units.require('user');

	addResources(this, auth, [
		[user, 'all']
	]);
};


module.exports = Contract;
