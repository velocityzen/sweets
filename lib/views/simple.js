"use strict";
var SimpleView = function (template) {
	this.templateFile = template;
	this.env = null;
};

SimpleView.prototype.unitInit = function (units) {
	this.env = units.require('core.template');
};

SimpleView.prototype.get = function(auth, data, cb) {
	data = data || {};
	data.auth = auth;
	this.env.render(this.templateFile, data, cb);
};


module.exports = SimpleView;
