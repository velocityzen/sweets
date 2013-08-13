"use strict";
var inherits = require('util').inherits;
var SuperApp = require('apis/lib/app');

var Db = require('./db');
var authUnits = require('./auth/units');
var apiUnits = require('./api/units');
var resourcesUnits = require('./resources/units');

var App = function (options) {
	SuperApp.call(this, options);
};
inherits(App, SuperApp);

App.prototype.addUnits = function () {
	var units = this.units;

	units.add('db', new Db());

	units.addSet( 'resources', resourcesUnits.create());
	units.addSet( 'auth',	authUnits.create());
	units.addSet( 'api',	apiUnits.create());
};


module.exports = App;
