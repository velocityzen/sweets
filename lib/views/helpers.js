"use strict";

var renderToResponse = function(ctx, errorsTemplate) {
	return function(err, result) {
		if(err) {
			result = errorsTemplate ? errorsTemplate.render({error: err}) : err;
			ctx.res.status(err.status);
		}

		ctx.res.end(result);
		ctx.responseSent();
		ctx.next();
	};
};


module.exports = {
	renderToResponse: renderToResponse
};
