"use strict";
let inherits = require("util").inherits;
let apis = require("apis");
let handlers = apis.handlers;
let contract = handlers.cont;

let Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	let userContract = units.require("user.contract");

	this.addItems([
		contract("/user", [userContract])
	]);
};

module.exports = Contract;
