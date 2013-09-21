"use strict";
//var errorTemplate = require('./templates').error;

var renderToResponse = function(ctx) {
	return function(err, result) {
/*		if(err) {
			result = errorTemplate.render({error: err});
			ctx.res.status(err.status);
		}*/

		ctx.res.end(result);
		ctx.responseSent();
		ctx.next();
	};
};


module.exports = {
	renderToResponse: renderToResponse
};
