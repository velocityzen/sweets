"use strict";

let roles;

let rolesHandler = function(ctx, cb) {
	let method = ctx.method;
	let units = ctx.mechanics.units;

	if(!roles) {
		roles = units.require("core.settings").roles;
	}

	let resource = ctx.path.split("/").splice(3);
	let resourceRoles = units.get("resources." + resource.join(".") + ".roles");

	if(resourceRoles && resourceRoles[method]) {
		let uri = ctx.auth.identity.role,
			rri = roles.indexOf(resourceRoles[method]);

		cb(null, ( (uri === rri) || (uri !== -1 && rri !== -1 && uri < rri) ));
	} else {
		cb(null, true);
	}
};


module.exports = rolesHandler;
