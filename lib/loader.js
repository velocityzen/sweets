"use strict";
var inherits = require('util').inherits;
var ApisLoader = require('apis/lib/loader');

var Loader = function (options, services) {
	ApisLoader.call(this, options);
	this.services = ['resource', 'db', 'user'];

	if(services) {
		this.services = this.services.concat(services);
	}
};
inherits(Loader, ApisLoader);

Loader.prototype.getSupportedCommands = function() {
	return Loader.super_.prototype.getSupportedCommands().concat(this.services);
};

Loader.prototype.run = function () {
	var cmd = process.argv[2];

	if(this.services.indexOf(cmd) === -1) {
		Loader.super_.prototype.run.call(this);
	} else {
		var w = this.getWorker();
		w.runService.apply(w, process.argv.slice(2));
	}
};

Loader.create = function (options) {
	return new Loader(options).getLoader(options);
};

Loader.run = function (options) {
	return Loader.create(options).run();
};


module.exports = Loader;
