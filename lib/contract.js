"use strict";
var inherits = require('util').inherits;
var apis = require('apis');
var addResource = require('apis-resource').add;
var locale = require("locale");
var handlers = apis.handlers;
var contract = handlers.cont;
var httpOnly = handlers.httpOnly;
var resource = apis.resources.res;
var st = handlers.st;

var Unit = require('units').Unit;
var UnitSet = require('units').UnitSet;
var rolesHandler = require('./auth/roles');
var renderToResponse = require('./views/helpers').renderToResponse;
var SimpleView = require('./views/simple_view');

var supportedLangs = new locale.Locales(["en", "ru"]);

var viewImpl = function(ctrl) {
	return function(ctx) {
		var data = ctx.data || {},
			cookies = ctx.req.cookies,
			lang;

		if (cookies.swts_language) {
			lang = cookies.swts_language;
		} else {
			lang = new locale.Locales(ctx.req.headers["accept-language"]).best(supportedLangs).language;
			ctx.res.cookie('swts_language', lang, { maxAge: 900000, httpOnly: false });
		}

		data.PATH = "/" + ctx.path;
		data.LANG = lang;

		ctrl.get(ctx.auth, data, renderToResponse(ctx));
	};
};

var Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.unitInit = function (units) {
	if(this.isMain) {
		var authContract = units.require('auth.contract'),
			apiVersion = units.require('core.settings').apiVersion || 1;

		this.add(contract('/auth',	[authContract]));
		this.addApi('/api/' + apiVersion , units);
	}

	if(this.addStatic) {
		var staticPath = units.require('core.settings').static;
		this.add(resource.subpaths('/static', st(staticPath)));
	}

	if(this.addTest) {
		this.add(contract('/test',	[apis.testPage.contract]));
	}

	if(this.urls) {
		this.addViews(units);
	}

};

Contract.prototype.addApi = function(base, units) {
	var apiRx = /^resources\..*(\.api)$/,
		//resources = units.require('resources'),
		loadedUnits = units.unitInfoDict,
		auth = units.require('auth').handler;

	for(var i in loadedUnits) {
		if(apiRx.test(i)) {
			var resApiUnit = units.get(i);
			addResource(this, auth, rolesHandler, resApiUnit, base);
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

Contract.prototype.addViews = function(units) {
	var auth =  units.require('auth').handler,
		view;

	for(var url in this.urls) {
		view = units.require(this.urls[url].name);

		this.add( resource(
			new RegExp(url),
			{
				get: [
					httpOnly(),
					auth(rolesHandler).unprotected.opt,
					viewImpl(view)
				]
			}
		));
	}
};


module.exports = Contract;
