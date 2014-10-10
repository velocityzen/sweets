"use strict";
var fs = require('fs');
var path = require('path');
var Q = require('queueue');
var log = require('./log');

var rxCtrl = /^resources\..*(?:\.controller)$/;

var Db = function(units) {
	this.ctrl = units.require("db");
	this.units = units;
};

Db.prototype.getScheme = function(ctrlUnitName) {
	var resourceCtrl = this.units.require(ctrlUnitName);
	return {
		box: resourceCtrl.box,
		scheme: resourceCtrl.scheme
	};
};

Db.prototype.getSchemes = function(resource) {
	var scheme, schemes = [];

	if(resource) {
		scheme = this.getScheme("resources." + resource.replace("/", ".") + ".controller");
		if(scheme.box) {
			schemes.push(scheme);
		}
	} else {
		var loadedUnits = this.units.unitInfoDict;

		for(var i in loadedUnits) {
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

	var q = new Q()
		.bind(this.ctrl)
		.on("drain", cb);

	var schemes = this.getSchemes(resource);

	for (var i in schemes) {
		q.push({
			method: taskName,
			args: [schemes[i], log.progress]
		});
	}

	q.run();
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
	var dbName = this.units.require("core.settings").db.name;

	this.ctrl.create(dbName, function(err, result) {
		cb(err, "Created db " + dbName);
	});
};

Db.prototype.drop = function(cb) {
	var dbName = this.units.require("core.settings").db.name;

	this.ctrl.drop(dbName, function(err, result) {
		cb(err , "Dropped db " + dbName);
	});
};

module.exports = Db;
