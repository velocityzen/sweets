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

	if(this.urls) {
		this.addViews(units, authFunction);
	}
};

Contract.prototype.addApi = function(base, units, authFunction) {
	var apiRx = /^resources\..*(\.api)$/,
		//resources = units.require('resources'),
		loadedUnits = units.unitInfoDict,
		settings = units.require('core.settings'),
		auth =  {
			handler: units.require('auth').handler,
			authFunc: authFunction
		};

	for(var i in loadedUnits) {
		if(apiRx.test(i)) {
			var resApiUnit = units.get(i);
			addResource(this, auth, {
				base: base,
				api: resApiUnit,
				settings: settings
			});
		}
	}
};

Contract.prototype.getUnits = function() {
	var view,
		units = new UnitSet();

	for(var url in this.urls) {
		view = this.urls[url];

		if(!(view instanceof Unit)) {
			view = new SimpleView(view.name, view.template);
		}

		units.add(view.name, view);
	}

	units.add('contract', this);

	return units;
};

Contract.prototype.addViews = function(units, authFunction) {
	var auth =  units.require('auth').handler,
		view;

	for(var url in this.urls) {
		view = units.require(this.urls[url].name);

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


module.exports = Contract;
