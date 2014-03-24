"use strict";
var fs = require('fs');
var path = require('path');
var async = require('async');
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


Db.prototype.getSchemeTasks = function(method, resource) {
	var self = this,
		q = [],
		schemes = this.getSchemes(resource);
	schemes.forEach(function(s, index) {
		q.push(function(cb) {
			self.ctrl[method](s, log.progress("box " + s.box), cb);
		});
	});

	return q;
};

Db.prototype.updateScheme = function (resource, cb) {
	if(cb === undefined) {
		cb = resource;
		resource = undefined;
	}

	var q = this.getSchemeTasks("applyScheme", resource);
	async.parallel(q, cb);
};

Db.prototype.dropScheme = function(resource, cb) {
	if(cb === undefined) {
		cb = resource;
		resource = undefined;
	}

	var q = this.getSchemeTasks("dropScheme", resource);
	async.parallel(q, cb);
};

Db.prototype.create = function(dbName, cb) {
	this.ctrl.create(dbName, cb);
};

Db.prototype.drop = function(dbName, cb) {
	this.ctrl.drop(dbName, cb);
};

module.exports = Db;
