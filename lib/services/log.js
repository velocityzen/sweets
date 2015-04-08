"use strict";

let group = function(groupName) {
	console.log("\x1B[32m\x1B[1m" + groupName + "\x1B[22m\x1B[39m");
};

let error = function(err) {
	console.log("\x1B[31m\x1B[1mERROR >\x1B[22m\x1B[39m", err);
};

let result = function(res) {
	console.log("\x1B[32m\x1B[1mOK >\x1B[22m\x1B[39m", res);
};

let progress = function(err, res) {
	if(err) {
		error(err.msg);
	} else {
		result(res);
	}
};

let done = function(err, res) {
	if(err) {
		if(Array.isArray(err)) {
			for(let i in err) {
				error(err[i].msg || err[i].message);
			}
		} else {
			error(err.msg || err.message);
		}

		console.log("");
	} else {
		res && result(res);
		console.log("\x1B[32m\x1B[1mDONE\x1B[22m\x1B[39m\n");
	}
	process.exit(0);
};


module.exports = {
	progress: progress,
	error: error,
	group: group,
	done: done
};
