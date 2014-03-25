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
			self.ctrl[method](s, log.progress, cb);
		});
	});

	return q;
};

Db.prototype.updateScheme = function (resource, cb) {
	if(cb === undefined) {
		cb = resource;
		resource = undefined;
	}

	var q = this.getSchemeTasks("updateScheme", resource);
	async.parallel(q, function(err, result) {
		cb(err);
	});
};

Db.prototype.dropScheme = function(resource, cb) {
	if(cb === undefined) {
		cb = resource;
		resource = undefined;
	}

	var q = this.getSchemeTasks("dropScheme", resource);
	async.parallel(q, function(err, result) {
		cb(err);
	});
};

Db.prototype.create = function(dbName, cb) {
	if(!cb) {
		dbName("No database name defined");
	} else {
		this.ctrl.create(dbName, function(err, result) {
			cb(err, "Created db " + dbName);
		});
	}
};

Db.prototype.drop = function(dbName, cb) {
	if(!cb) {
		dbName("No database name defined");
	} else {
		this.ctrl.drop(dbName, function(err, result) {
			cb(err , "Dropped db " + dbName);
		});
	}
};

module.exports = Db;
