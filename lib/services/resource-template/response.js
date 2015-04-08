"use strict";
let v = require("../validators");

let Response = function () {};

Response.prototype.unitInit = function(units) {};

Response.prototype.get = function() {
	return v.any;
};

Response.prototype.create = function() {
	return v.any;
};

Response.prototype.update = function() {
	return v.any;
};

Response.prototype.del = function() {
	return v.any;
};

module.exports = Response;
