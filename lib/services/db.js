"use strict";
let Q = require("queueue");
let log = require("./log");

let rxCtrl = /^resources\..*(?:\.controller)$/;

let Db = function(units) {
	this.ctrl = units.require("db");
	this.units = units;
};

Db.prototype.getScheme = function(ctrlUnitName) {
	let resourceCtrl = this.units.require(ctrlUnitName);
	return {
		box: resourceCtrl.box,
		scheme: resourceCtrl.scheme
	};
};

Db.prototype.getSchemes = function(resource) {
	let scheme, schemes = [];

	if(resource) {
		scheme = this.getScheme("resources." + resource.replace("/", ".") + ".controller");
		if(scheme.box) {
			schemes.push(scheme);
		}
	} else {
		let loadedUnits = this.units.unitInfoDict;

		for(let i in loadedUnits) {
			if(rxCtrl.test(i)) {
				scheme = this.getScheme(i);
				if(scheme.box) {
					schemes.push(scheme);
				}
			}
		}
	}

	return schemes;
};

Db.prototype.runSchemeTasks = function(taskName, resource, cb) {
	if(cb === undefined) {
		cb = resource;
		resource = undefined;
	}

	let q = new Q()
		.bind(this.ctrl)
		.on("drain", cb);

	let schemes = this.getSchemes(resource);

	for (let i in schemes) {
		q.push({
			method: taskName,
			args: [schemes[i], log.progress]
		});
	}
};

Db.prototype.rebuildIndexes = function(resource, cb) {
	this.runSchemeTasks("rebuildIndexes", resource, cb);
};

Db.prototype.updateScheme = function (resource, cb) {
	this.runSchemeTasks("updateScheme", resource, cb);
};

Db.prototype.dropScheme = function(resource, cb) {
	this.runSchemeTasks("dropScheme", resource, cb);
};

Db.prototype.create = function(cb) {
	let dbName = this.units.require("core.settings").db.options.db;

	this.ctrl.create(dbName, function(err) {
		cb(err, "Created db " + dbName);
	});
};

Db.prototype.drop = function(cb) {
	let dbName = this.units.require("core.settings").db.options.db;

	this.ctrl.drop(dbName, function(err) {
		cb(err, "Dropped db " + dbName);
	});
};

module.exports = Db;
