"use strict";
var inherits = require('util').inherits;
var async = require('async');
var Unit = require('units').Unit;

var valid = require('valid');
var v = valid.validators;
var vl = require('./validators');

var DuplicateError = require('./errors').DuplicateError;
var ForbiddenError = require('./errors').ForbiddenError;
var BadRequestError = require('./errors').BadRequestError;

var resultErrHandler = require('./errors').resultErrHandler;

var User = function () {};
inherits(User, Unit);

User.prototype.name = 'user';

User.prototype.validators = {

	get: v.opt({
		username: v.str
	}),

	create: {
		username: v.str,
		password: v.str,
		email: vl.email,
		displayName: v.opt(v.str),
	},

	update: v.or(
		{displayName: v.str},
		{currentBoard: vl.slug},
		{password: v.str}
	),

	del: {
		username: v.str
	}
};

User.prototype.unitInit = function (units) {
	this.ctrl = units.require('controllers.user');
};

User.prototype.get = function (auth, userData, cb) {
	var userId, fields = {};

	fields.auth = false;

	if(userData) {
		userId = userData.username;

		if(!auth || userId !== auth.identity) {
			fields.email = false;
			fields.boards = false;
		}

		this.ctrl.get(userId, fields, resultErrHandler(BadRequestError, 'user', cb));

	} else if(!auth) {
		cb(new ForbiddenError());
	} else {
		this.ctrl.getFull(auth.identity, resultErrHandler(BadRequestError, 'user', cb));
	}
};

User.prototype.create = function (auth, userData, cb) {
	var self = this;

	userData.username = userData.username.toLowerCase();
	userData.email = userData.email.toLowerCase();

	if(this.filter.isRestricted(userData.username)) {
		cb(new ForbiddenError('It looks like this username is forbidden.', 'username'));
	} else {

		this.ctrl.add(userData, function(err, result) {
			if(err) {
				if(err.name == 'MongoError' && err.code == 11000) {
					var errKey;
					if( /\$_id/.test(err.err) ) {
						errKey = 'username';
					} else if (/\$email/.test(err.err)) {
						errKey = 'email';
					}
					cb(new DuplicateError('It looks like this user is already exist here.', errKey));
				}
			} else {
				cb(null, {created: userData.username});
			}
		});
	}
};

User.prototype.update = function (auth, userData, cb) {
	if(userData.password) {
		this.ctrl.updatePassword(auth.identity, userData.password,
			resultErrHandler(BadRequestError, {updated: auth.identity}, cb)
		);
	} else {
		this.ctrl.update(auth.identity, userData,
			resultErrHandler(BadRequestError, {updated: auth.identity}, cb)
		);
	}
};

User.prototype.del = function (auth, userData, cb) {
	if(auth.identity === userData.username) {
		this.ctrl.remove(auth.identity,
			resultErrHandler(BadRequestError, {removed:auth.identity}, cb)
		);
	} else {
		cb(new ForbiddenError());
	}
};

module.exports = User;
