"use strict";
let path = require("path");
let nunjucks = require("nunjucks");
let UnitSet = require("units").UnitSet;
let inherits = require("util").inherits;
let SuperApp = require("apis/lib/app");

let dateFilter = require("./filters/date");
let MatchTag = require("./tags/match");

let App = function (options) {
	SuperApp.call(this, options);
	this.sweetsPath = path.join(process.cwd(), "node_modules");
};
inherits(App, SuperApp);

App.prototype.addUnits = function (options) {
	let units = this.units,
		settings = units.require("core.settings");

	options = options || {};

	if(settings.db) {
		let DbUnits = require("./db");
		let Db = this.getSweet(settings.db.sweet).Db;
		units.add("db", new DbUnits(Db));
	}

	if(typeof options.auth === "object") {
		units.addSet("auth", options.auth);
	} else 	if(options.auth === undefined || options.auth === "sweets") {
		let authUnits = require("./auth/units");
		units.addSet("auth", authUnits());
	}

	if(settings.cache) {
		this.loadCacheEngine(settings.cache);
	}

	this.loadTemplateEngine(settings.templatePath, settings.errorsTemplate);
	this.loadResources(options.resources, settings.sweets);
};

App.prototype.getSweet = function(sweetName) {
	return require(path.join(this.sweetsPath, "sweets-" + sweetName));
};

App.prototype.loadTemplateEngine = function(templatePath, errorsTemplateName) {
	let env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templatePath));

	env.addFilter("date", dateFilter);
	env.addExtension("Match", new MatchTag());

	this.units.expose("core.template", env);

	if(errorsTemplateName) {
		let errorsTemplate = env.getTemplate(errorsTemplateName, true);
		this.units.expose("core.template.errors", errorsTemplate);
	}
};

App.prototype.loadCacheEngine = function(options) {
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
