"use strict";
var inherits = require('util').inherits;
var Conflict = require('apis').errors.Conflict;
var ForbiddenError = require('apis').errors.Forbidden;
var NotFoundError = require('apis').errors.NotFound;
var BadRequestError = require('apis').errors.BadRequest;

var resultErrHandler = require('../db/errors').resultErrHandler;

var DuplicateError = function (msg, key) {
	Conflict.call(this);
	this.msg = msg;
	this.key = key;
};
inherits(DuplicateError, Conflict);

DuplicateError.prototype.name = 'DuplicateError';

DuplicateError.prototype.getMessage = function() {
	return this.msg;
};

DuplicateError.prototype.getDetails = function (isDebug) {
	var result = DuplicateError.super_.prototype.getDetails.call(this, isDebug);
	result.key = this.key;
	return result;
};


module.exports = {
	ForbiddenError: ForbiddenError,
	NotFoundError: NotFoundError,
	BadRequestError: BadRequestError,
	DuplicateError: DuplicateError,

	resultErrHandler: resultErrHandler
};
