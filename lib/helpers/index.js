"use strict";

var renderToResponse = function(ctx, errorsTemplate) {
	return function(err, result) {
		if(err) {
			result = errorsTemplate ? errorsTemplate.render({error: err}) : err.toString();
			ctx.res.status(err.status || 400);
		}
		// console.log("1", ctx.res);
		ctx.res.end(result);
		// console.log("2");
		ctx.responseSent();
		// console.log("3");
		ctx.next();
		// console.log("4");
	};
};


module.exports = {
	renderToResponse: renderToResponse
};
