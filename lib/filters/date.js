"use strict";
let moment = require("moment");

module.exports = function(date, format, locale) {
	if(locale) {
		moment.locale(locale);
	}

	return moment(date).format(format);
};
