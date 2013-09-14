"use strict";
var inherits = require('util').inherits;
var path = require('path');
var apis = require('apis');
var addResource = require('apis-resource').add;
var resource = apis.resources.res;
var handlers = apis.handlers;
var contract = handlers.cont;
var st = handlers.st;
var rolesHandler = require('./auth/roles');

var Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units, options) {
	this.isMain = true;

	var apiVersion = units.require('core.settings').apiVersion || 1;
	var authContract = units.require('auth.contract');
	this.add(contract('/auth',	[authContract]));

	this.addApi('/api/' + apiVersion , units);
};

Contract.prototype.addApi = function(base, units) {
	var apiRx = /^resources\..*(\.api)$/,
		//resources = units.require('resources'),
		loadedUnits = units.unitInfoDict,
		auth = units.require('auth').handler;

	for(var i in loadedUnits) {
		if(apiRx.test(i)) {
			var resApiUnit = units.get(i);
			addResource(this, auth, rolesHandler, resApiUnit, base);
		}
	}
};


module.exports = Contract;
