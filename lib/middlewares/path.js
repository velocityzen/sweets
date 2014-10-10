"use strict";

module.exports = function(ctx) {
	ctx.data.PATH = "/" + ctx.path;
	return ctx;
};
