"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;

var ErrorView = function (error) {
	this.error = error;
	this.template = null;
};
inherits(ErrorView, Unit);

ErrorView.prototype.unitInit = function (units) {
	this.template = units.require('core.template.errors');
};

ErrorView.prototype.get = function(auth, data, cb) {
	data.error = this.error;
	this.template.render(data, cb);
};


module.exports = ErrorView;
