"use strict";
let path = require("path");
let UnitSet = require("units").UnitSet;
let inherits = require("util").inherits;
let SuperApp = require("apis/lib/app");

let App = function (options) {
	SuperApp.call(this, options);
	this.sweetsPath = path.join(process.cwd(), "node_modules");
};
inherits(App, SuperApp);

App.prototype.addUnits = function (options) {
	let units = this.units,
		settings = units.require("core.settings"),
		debug = settings.debug;

	options = options || {};

	if(options.auth) {
		this.loadAuth(options.auth);
	} else if(settings.auth) {
		this.loadAuth(settings.auth);
	}

	settings.db && this.loadDbSweet(settings.db, debug);
	settings.cache && this.loadCacheSweet(settings.cache, debug);
	settings.template && this.loadTemplateSweet(settings.template, debug);

	this.loadResources(options.resources, settings.resources);
};

App.prototype.getSweet = function(sweetName) {
	return require(path.join(this.sweetsPath, "sweets-" + sweetName));
};

App.prototype.loadAuth = function(options) {
	if(typeof options === "object") {
		this.units.addSet("auth", options);
	} else 	if(options === "sweets") {
		let authUnits = require("./auth/units");
		this.units.addSet("auth", authUnits());
	}
};

App.prototype.loadDbSweet = function(options) {
	let DbUnit = require("./db");
	let DbClass = this.getSweet(options.sweet);
	let dbInstance = new DbClass(options.options);
	this.units.add("db", new DbUnit(dbInstance));
};

App.prototype.loadTemplateSweet = function(options, debug) {
	let ext = options.extension ? this.getSweet(options.extension) : null;
	let env = this.getSweet(options.sweet)(options.options, ext, debug);

	this.units.expose("core.template", env);

	if(options.options.errorsTemplate) {
		let errorsTemplate = env.getTemplate(options.options.errorsTemplate, true);
		this.units.expose("core.template.errors", errorsTemplate);
	}
};

App.prototype.loadCacheSweet = function(options) {
	let Cache = this.getSweet(options.sweet),
		cache = new Cache(options);

	this.units.expose("core.cache", {
		cache: function(ns) {
			return cache ? cache.getCache(ns) : false;
		}
	});
};

App.prototype.loadResources = function(localResources, sweetResources) {
	let resModule, resUnits,
		resources = localResources || new UnitSet();

	this.resourceModules = {};

	for(let i in sweetResources) {
		resModule = this.getSweet(sweetResources[i]);
		resUnits = resModule();
		resources.joinSet(resUnits);
		this.resourceModules[sweetResources[i]] = resModule;
	}

	this.units.addSet("resources", resources);
};

//service
App.prototype.runService = function(serviceName, serviceCommand) {
	this.ensureInited();
	let done = require("./services/log").done;
	let	Service;

	try {
		Service = require(path.join(process.cwd(), "lib", "services", serviceName));
	} catch(e) {
		Service = require("./services/" + serviceName);
	}

	if(Service) {
		let service = new Service(this.units),
			args = [].slice.call(arguments, 2);

		if(service[serviceCommand]) {
			args.push(done);
			service[serviceCommand].apply(service, args);
		} else {
			done(new Error(serviceName + " doesn't have a '" + serviceCommand + "' command"));
		}
	} else {
		done(new Error("Service not found"));
	}
};


module.exports = App;
