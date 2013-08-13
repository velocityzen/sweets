"use strict";
var inherits = require('util').inherits;
var apis = require('apis');
var handlers = apis.handlers;
var contract = handlers.cont;

var Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	var personContract = units.require('person.contract');

	this.addItems([
		contract('/user', [personContract])
	]);
};

module.exports = Contract;
