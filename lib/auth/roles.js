"use strict";

var roles;

var rolesHandler = function(ctx, cb) {
	var method = ctx.method;
	var units = ctx.mechanics.units;

	if(!roles) {
		roles = units.require('core.settings').roles;
	}

	var resource = ctx.path.split('/').splice(3);
	var resourceRoles = units.get('resources.' + resource.join('.') + '.roles');

	if(resourceRoles && resourceRoles[method]) {
		var uri = ctx.auth.identity.role,
			rri = roles.indexOf(resourceRoles[method]);

		cb(null, ( (uri === rri) || (uri !== -1 && rri !== -1 && uri < rri) ));
	} else {
		cb(null, true);
	}
};


module.exports = rolesHandler;
