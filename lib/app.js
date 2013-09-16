"use strict";
var path = require('path');
var nunjucks = require('nunjucks');
var UnitSet = require('units').UnitSet;
var inherits = require('util').inherits;
var SuperApp = require('apis/lib/app');
var Db = require('./db');


var App = function (options) {
	SuperApp.call(this, options);
};
inherits(App, SuperApp);

App.prototype.addUnits = function (options) {
	var units = this.units,
		settings = units.require('core.settings');

	units.add('db', new Db());

	if(options.auth === 'sweets') {
		var authUnits = require('./auth/units');
		units.addSet('auth', authUnits.create());
	} else if(typeof options.auth === "object") {
		units.addSet('auth', options.auth.create());
	}

	if(options.cache) {
		this.loadCacheEngine(units, options.cache);
	}

	this.loadTemplateEngine(units, settings.templates);
	this.loadResources(units, options.resources, settings.sweets);
};

App.prototype.loadTemplateEngine = function(units, templatesPath) {
	var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templatesPath));
	units.expose('core.template', env);
};

App.prototype.loadCacheEngine = function(units, Cache) {
	var cache = new Cache();
	units.expose('core.cache', {
		cache: function(ns) {
			return cache ? cache.getCache(ns) : false;
		}
	});
};

App.prototype.loadResources = function(units, localResources, sweetResources) {
	var resModule, resUnit,
		resources = localResources.create(),
		sweetsHome = path.join(process.cwd(), 'node_modules');

	this.resourceModules = {};

	for(var i in sweetResources) {
		resModule = require(path.join(sweetsHome, 'sweets-' + sweetResources[i]));
		resUnit = new UnitSet();
		resUnit.addSet(resModule.name, resModule.units.create());
		resources.joinSet(resUnit);

		this.resourceModules[sweetResources[i]] = resModule;
	}

	units.addSet('resources', resources);
};

App.prototype.dbUpdateScheme = function (resName) {
	this.ensureInited();

	var dbServices = require('./services/db.js'),
		db = this.units.require('db'),
		modules = {};

	if(resName) {
		modules[resName] = this.resourceModules[resName];
	} else {
		modules = this.resourceModules;
		try {
			modules.sweets = require(path.join(process.cwd(), 'lib', 'scheme'));
		} catch(e) {}
	}

	dbServices.updateScheme(db, modules);
};

App.prototype.dbLoadContent = function(fileName) {
	this.ensureInited();

	var dbServices = require('./services/db.js'),
		db = this.units.require('db'),
		files;

	if(fileName) {
		files = [fileName];
	} else {
		files = 'content';
	}

	dbServices.loadContent(db, files);
};

App.prototype.createUser = function(role, email, password, displayName) {
	this.ensureInited();

	var done = require('./services/out').done;
	var user = this.units.get('resources.user.controller');

	if(user) {
		var newUser = {
				role: role,
				email: email,
				password: password,
				displayName: displayName
			},
			v = require('valid'),
			userValid = this.units.get('resources.user.api').methods.create,
			result = v.validate(newUser, v.validators.spec(userValid), {stopOnFirstError: false, errors: {needMessage: true}});

		if (result.hasErrors()) {
			done(result.errors);
		} else{
			user.create(newUser, done);
		}
	} else {
		done("No users' sweet");
	}
};


module.exports = App;
