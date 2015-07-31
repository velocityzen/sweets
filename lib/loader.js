"use strict";
let inherits = require("util").inherits;
let ApisLoader = require("apis/lib/loader");

let Loader = function (options, services) {
	ApisLoader.call(this, options);
	this.services = ["resource", "db", "user", "service"];

	if(services) {
		this.services = this.services.concat(services);
	}
};
inherits(Loader, ApisLoader);

Loader.prototype.getSupportedCommands = function() {
	return Loader.super_.prototype.getSupportedCommands().concat(this.services);
};

Loader.prototype.run = function () {
	let cmd = process.argv[2];

	if(this.services.indexOf(cmd) === -1) {
		Loader.super_.prototype.run.call(this);
	} else {
		let w = this.getWorker();
		w.runService.apply(w, process.argv.slice(2));
	}
};

module.exports = Loader;
