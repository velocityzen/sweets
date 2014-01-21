"use strict";
var path = require('path');
var nunjucks = require('nunjucks');
var UnitSet = require('units').UnitSet;
var inherits = require('util').inherits;
var SuperApp = require('apis/lib/app');


var App = function (options) {
	SuperApp.call(this, options);
	this.sweetsPath = path.join(process.cwd(), 'node_modules');
};
inherits(App, SuperApp);

App.prototype.addUnits = function (options) {
	var units = this.units,
		settings = units.require('core.settings');

	options = options || {};

	if(settings.db) {
		var DbUnits = require('./db');
		var Db = this.getSweet(settings.db.sweet).Db;
		units.add('db', new DbUnits(Db));
	}

	if(settings.cache) {
		this.loadCacheEngine(settings.cache);
	}

	if(options.auth === undefined || options.auth === 'sweets') {
		var authUnits = require('./auth/units');
		units.addSet('auth', authUnits.create());
	} else if(typeof options.auth === "object") {
		units.addSet('auth', options.auth);
	}

	this.loadTemplateEngine(settings.templatePath, settings.errorsTemplate);
	this.loadResources(options.resources, settings.sweets);
};

App.prototype.getSweet = function(sweetName) {
	return require(path.join(this.sweetsPath, 'sweets-' + sweetName));
};

App.prototype.loadTemplateEngine = function(templatePath, errorsTemplateName) {
	var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templatePath));
	this.units.expose('core.template', env);

	if(errorsTemplateName) {
		var errorsTemplate = env.getTemplate(errorsTemplateName, true);
		this.units.expose('core.template.errors', errorsTemplate);
	}
};

App.prototype.loadCacheEngine = function(options) {
	var Cache = this.getSweet(options.sweet),
		cache = new Cache(options);

	this.units.expose('core.cache', {
		cache: function(ns) {
			return cache ? cache.getCache(ns) : false;
		}
	});
};

App.prototype.loadResources = function(localResources, sweetResources) {
	var resModule, resUnit,
		resources = localResources || new UnitSet();

	this.resourceModules = {};

	for(var i in sweetResources) {
		resModule = this.getSweet(sweetResources[i]);
		resUnit = new UnitSet();
		resUnit.addSet(resModule.name, resModule.units.create());
		resources.joinSet(resUnit);

		this.resourceModules[sweetResources[i]] = resModule;
	}

	this.units.addSet('resources', resources);
};

//cli commands
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
			modules.sweets = require(path.join(process.cwd(), 'lib', 'schemes'));
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

App.prototype.dbDrop = function (resName) {
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

	dbServices.drop(db, modules);
};

App.prototype.createUser = function(email, password, role) {
	this.ensureInited();

	var done = require('./services/out').done;
	var user = this.units.get('resources.user.controller');

	if(user) {
		var settings = this.units.require('core.settings');
		var newUser = {
				email: email,
				password: password
			},
			v = require('valid'),
			userValid = this.units.get('resources.user.request').create(settings);


		if(role) {
			newUser.role = role;
		}

		var result = v.validate(newUser, v.validators.spec(userValid), {stopOnFirstError: false, errors: {needMessage: true}});

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
