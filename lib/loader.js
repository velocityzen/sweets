"use strict";
var inherits = require('util').inherits;
var SuperLoader = require('apis/lib/loader');

var Loader = function (opt_options) {
	SuperLoader.call(this, opt_options);
};
inherits(Loader, SuperLoader);

Loader.prototype.getSupportedCommands = function() {
	return Loader.super_.prototype.getSupportedCommands().concat(['db_update_scheme', 'db_load_content', 'db_drop']);
};

Loader.prototype.run = function () {
	var cmd = process.argv[2];
	switch (cmd) {
		case 'db_update_scheme':
			this.getWorker().dbUpdateScheme(process.argv[3]);
			break;
		case 'db_load_content':
			this.getWorker().dbLoadContent(process.argv[3]);
			break;
		case 'db_drop':
			this.getWorker().dbDrop(process.argv[3]);
			break;
		default:
			Loader.super_.prototype.run.call(this);
			break;
	}
};

Loader.create = function (opt_options) {
	return new Loader(opt_options).getLoader(opt_options);
};

Loader.run = function (opt_options) {
	return Loader.create(opt_options).run();
};


module.exports = Loader;
