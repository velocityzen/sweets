"use strict";
var ErrorView = function (error) {
	this.error = error;
	this.template = null;
};

ErrorView.prototype.unitInit = function (units) {
	this.template = units.require('core.template.errors');
};

ErrorView.prototype.get = function(auth, data, cb) {
	data = data || {};
	data.error = this.error;
	this.template.render(data, cb);
};


module.exports = ErrorView;
