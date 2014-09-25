"use strict";
var path = require('path');
var nunjucks = require('nunjucks');
var UnitSet = require('units').UnitSet;
var inherits = require('util').inherits;
var SuperApp = require('apis/lib/app');

var dateFilter = require('./filters/date');
var MatchTag = require('./tags/match');

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

	env.addFilter('date', dateFilter);
	env.addExtension('Match', new MatchTag());

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
		resUnit = resModule.create();
		resources.joinSet(resUnit);
		this.resourceModules[sweetResources[i]] = resModule;
	}

	this.units.addSet('resources', resources);
};

//service
App.prototype.runService = function(serviceName, serviceMethod) {
	this.ensureInited();
	var Service;

	try {
		Service = require(path.join(process.cwd(), 'lib', 'services', serviceName));
	} catch(e) {
		Service = require("./services/" + serviceName);
	}

	var done = require('./services/log').done,
		service = new Service(this.units),
		args = [].slice.call(arguments, 2);

	args.push(done);
	service[serviceMethod].apply(service, args);
};


module.exports = App;
