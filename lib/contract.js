"use strict";
var inherits = require('util').inherits;
var apis = require('apis');
var addResource = require('apis-resource').add;
var handlers = apis.handlers;
var contract = handlers.cont;
var httpOnly = handlers.httpOnly;
var resource = apis.resources.res;
var st = handlers.st;

var Unit = require('units').Unit;
var UnitSet = require('units').UnitSet;
var renderToResponse = require('./views/helpers').renderToResponse;
var SimpleView = require('./views/simple_view');

var viewImpl = function(view, middlewares) {
	return function(ctx) {
		for(var m in middlewares) {
			ctx = middlewares[m](ctx);
		}
		view.get(ctx.auth, ctx.data, renderToResponse(ctx));
	};
};

var Contract = function () {
	handlers.Contract.call(this);
	this.middlewares = [];
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	var settings = units.require('core.settings'),
		authFunction = settings.roles ? require('./auth/roles') : null;

    if(this.isMain) {
		var authContract = units.require('auth.contract'),
			apiVersion = settings.apiVersion || 1;

		if(authContract) {
			this.add(contract('/auth',	[authContract]));
		}

		this.addApi('/api/' + apiVersion, units, authFunction);
	}

	if(this.addStatic) {
		this.add(resource.subpaths('/static', st(settings.staticPath)));
	}

	if(this.addTest) {
		this.add(contract('/test',	[apis.testPage.contract]));
	}
};

Contract.prototype.addApi = function(base, units, authFunction) {
	var apiRx = /^resources\..*(\.api)$/,
		loadedUnits = units.unitInfoDict,
		settings = units.require('core.settings'),
		auth =  {
			handler: units.require('auth').handler,
			authFunc: authFunction
		};

	for(var i in loadedUnits) {
		if(apiRx.test(i)) {
			//remove '.api' from name to get resource unit set name
			var res = i.substring(0, i.length - 4);
			addResource(this, auth, {
				base: base,
				api: units.get(i),
				request: units.get(res + '.request'),
				response: units.get(res + '.response'),
				options: settings
			});
		}
	}
};


Contract.prototype.addViews = function(units, views) {
	var settings = units.require('core.settings'),
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
					viewImpl(view, this.middlewares)
				]
			}
		));
	}
};

Contract.prototype.use = function(middleware) {
	this.middlewares.push(middleware);
};


module.exports = Contract;
