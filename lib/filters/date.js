"use strict";
var moment = require('moment');

var date = function(date, format, locale) {
    if(locale) {
        moment.locale(locale);
    }

    return moment(date).format(format);
};

module.exports = date;
