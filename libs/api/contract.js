"use strict";
var inherits = require('util').inherits;
var path = require('path');

var apis = require('apis');
var resource = apis.resources.res;
var handlers = apis.handlers;
var data = handlers.data;
var impl = handlers.impl;
var impls = handlers.impls;
var ret = handlers.ret;
var st = handlers.st;

var valid = require('valid');
var str = valid.validators.str;
var any = valid.validators.any;

//var coauthClientDir = require('coauth').clientDir;
var renderToResponse = require('../views/response');

var Contract = function () {
	handlers.Contract.call(this);
};
inherits(Contract, handlers.Contract);

Contract.prototype.createImpl = function (ctrl, method) {
	return function (ctx) {
				//setTimeout(function() {
					ctrl[method](ctx.auth, ctx.data, ctx.cb);
				//}, 3333);
			};
};

Contract.prototype.addResources = function (auth, resources) {
	var defaultMethods = ['get', 'create', 'update', 'del'],
		resRes = [];

	for(var i in resources) {
		var r = resources[i],
			ctrl = r[0],
			methods = r[1] || undefined,
			resourceMethods = {};

		if(methods === 'all' || methods === undefined) {
			methods = defaultMethods;
		}

		for(var j in methods) {
			var mName = methods[j],
				m = resourceMethods[mName] = [];

			if(!(mName === 'create' && ctrl.name === 'user')) {
				if(mName === 'get') {
					m.push(auth().opt); // get auth
				} else {
					m.push(auth()); // other methods auth
				}
			}
			m.push(data(ctrl.validators[mName]));
			m.push(ret.any);
			m.push(impl( this.createImpl(ctrl, mName) ));
		}

		resRes.push(
			resource('/' + ctrl.name, resourceMethods)
		);
	}

	this.addItems(resRes);
};

Contract.prototype.unitInit = function (units) {
	var auth =	units.require('auth').handler;
	var user =	units.require('user');
	var board = units.require('board');
	var boardPill = units.require('board_pill');
	var boardUser = units.require('board_user');
	var mood =	units.require('mood');

	this.addItems([
		//resource.get(/coauth.js/, st(path.join(coauthClientDir, 'dev', 'coauth.dev.global.js'))),
		resource.get(/auth\/extrnal\/?$/, st(path.join(__dirname, '../../static/api1/auth/external.html'))),
		resource.get(/proxy\/?$/, st(path.join(__dirname, '../../static/api1/proxy.html')))
	]);

	this.addResources(auth, [
		[user, 'all'],
		[board, 'all'],
		[boardPill, ['create', 'del']],
		[boardUser, ['create', 'del']],
		[mood, 'all']
	]);
};


module.exports = Contract;
