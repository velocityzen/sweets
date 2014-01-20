"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;

var SimpleView = function (template) {
	this.templateFile = template;
	this.env = null;
};
inherits(SimpleView, Unit);

SimpleView.prototype.unitInit = function (units) {
	this.env = units.require('core.template');
};

SimpleView.prototype.get = function(auth, data, cb) {
	this.env.render(this.templateFile, data, cb);
};


module.exports = SimpleView;
