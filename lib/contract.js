"use strict";
var inherits = require('util').inherits;
var apis = require('apis');
var addResource = require('apis-resource').add;
var handlers = apis.handlers;
var contract = handlers.cont;
var httpOnly = handlers.httpOnly;
var resource = apis.resources.res;

var Unit = require('units').Unit;
var UnitSet = require('units').UnitSet;
var renderToResponse = require('./views/helpers').renderToResponse;

var path = require('path');
var middlewarePath = path.join(process.cwd(), "lib", "middlewares");

var apiRx = /^resources\..*(\.api)$/;

var Contract = function () {
	handlers.Contract.call(this);
	this.middlewares = [];
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	var settings = units.require('core.settings'),
		authFunction = settings.roles ? require('./auth/roles') : null;

	this.units = units;

    if(this.isMain) {
		var authContract = units.require('auth.contract'),
			apiVersion = settings.apiVersion || 1;

		if(authContract) {
			this.add(contract('/auth',	[authContract]));
		}

		this.addApi('/api/' + apiVersion, authFunction);
	}

	if(this.isMain && settings.core.debug) {
		this.add(contract('/test',	[apis.testPage.contract]));
		this.add(resource.subpaths(settings.staticUrl || "/static", handlers.st(settings.staticPath)));
	}
};

Contract.prototype.addApi = function(base, authFunction) {
	var units = this.units,
		loadedUnits = units.unitInfoDict,
		auth =  {
			handler: units.require('auth').handler,
			authFunc: authFunction
		};

	for(var i in loadedUnits) {
		if(apiRx.test(i)) {
			addResource(this, auth, {
				base: base,
				api: units.get(i),
				request: units.get(i.replace(".api", '.request')),
				response: units.get(i.replace(".api", '.response'))
			});
		}
	}
};

Contract.prototype.addViews = function(views) {
	var units = this.units,
		settings = units.require('core.settings'),
		authFunction = settings.roles ? require('./auth/roles') : null,
		auth =  units.require('auth').handler;

	for(var url in views) {
		var view = units.require(views[url]);
		this.add( resource(
			new RegExp(url),
			{
				get: [
					httpOnly(),
					auth(authFunction).unprotected.opt,
					this.getViewImplementation(view)
				]
			}
		));
	}
};

Contract.prototype.getViewImplementation = function(view) {
	var units = this.units,
		errorsTemplate = units.get('core.template.errors'),
		middlewares = this.middlewares;

	return function(ctx) {
		for(var m in middlewares) {
			ctx = middlewares[m](ctx, units);
		}

		var args = [ctx.auth, ctx.data];

		if(ctx.pathMatchResult) {
			args = args.concat(ctx.pathMatchResult.slice(1));
		}

		args.push(renderToResponse(ctx, errorsTemplate));
		view.get.apply(view, args);
	};
};

Contract.prototype.use = function(name) {
	if(!this.middlewares.length) {
		this.middlewares.push(require('./middlewares/empty'));
	}

	var middleware;
	try {
		middleware = require(middlewarePath + "/" + name);
	} catch(e) {
		middleware = require('./middlewares/'+name);
	}

	this.middlewares.push(middleware);
};


module.exports = Contract;
