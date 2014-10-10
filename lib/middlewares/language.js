"use strict";

module.exports = function(ctx, units) {
	var languages = units.require('core.settings').languages,
		cookies = ctx.req.cookies,
		language;

	if (cookies.language) {
		language = cookies.language;
	} else {
		var acceptLanguage = ctx.req.headers["accept-language"];
		if(acceptLanguage) {
			for (var i = languages.length - 1; i >= 0; i--) {
				var rx = new RegExp(languages[i], "i");
				if(acceptLanguage.match(rx)) {
					language = languages[i];
					break;
				}
			}
		}

		if(!language) {
			language = languages[0];
		}
		ctx.res.cookie('language', language, { maxAge: 900000, httpOnly: false });
	}

	ctx.data.LANGUAGE = language;

	return ctx;
};
