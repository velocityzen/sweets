"use strict";
var fs = require('fs');
var path = require('path');
var async = require('async');
var log = require('./log');

var Db = function(units) {
	this.ctrl = units.require("db");
	this.sweets = units.require("core.settings").sweets;
	this.moduleNames = [];
};

Db.prototype.getModules = function(module) {
	var modules = [],
		sweetsPath = path.join(process.cwd(), 'node_modules');

	if(module) {
		this.moduleNames.push(module);
		modules.push( module === "local" ?
			require(path.join(process.cwd(), 'lib', 'scheme')) :
			require(path.join(sweetsPath, 'sweets-' + module))
		);
	} else {
		for(var sweet in this.sweets) {
			this.moduleNames.push(this.sweets[sweet]);
			modules.push(
				require(path.join(sweetsPath, 'sweets-' + this.sweets[sweet]))
			);
		}

		try {
			modules.push(
				require(path.join(process.cwd(), 'lib', 'scheme'))
			);

			this.moduleNames.push("local");
		} catch(e) {}
	}

	return modules;
};


Db.prototype.getSchemeTasks = function(method, module) {
	var self = this,
		q = [],
		modules = this.getModules(module);

	modules.forEach(function(m, index) {
		var scheme = m.scheme;

		if(scheme) {
			q.push(function(cb) {
				self.ctrl[method](scheme, log.progress(self.moduleNames[index]), cb);
			});
		}
	});

	return q;
};

Db.prototype.updateScheme = function (module, cb) {
	if(cb === undefined) {
		cb = module;
		module = undefined;
	}

	var q = this.getSchemeTasks("applyScheme", module);
	async.parallel(q, cb);
};

Db.prototype.dropScheme = function(module, cb) {
	if(cb === undefined) {
		cb = module;
		module = undefined;
	}

	var q = this.getSchemeTasks("dropScheme", module);
	async.parallel(q, cb);
};

module.exports = Db;
