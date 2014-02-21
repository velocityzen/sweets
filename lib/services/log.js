"use strict";

var group = function(groupName) {
	console.log('\x1B[32m\x1B[1m[',groupName, ']\x1B[22m\x1B[39m');
};

var progress = function(base) {
	return function(result) {
		console.log('\x1B[32m\x1B[1m[',base, ']\x1B[22m\x1B[39m\n', result, '\n');
	};
};

var done = function(err, result) {
	if(err) {
		console.log('\n\x1B[31m\x1B[1m[ ERROR ] in\x1B[22m\x1B[39m\n', err);
	} else {
		console.log('\n\x1B[32m\x1B[1m[ DONE ]\x1B[22m\x1B[39m\n');
	}
	process.exit();
};


module.exports = {
	progress: progress,
	group: group,
	done: done
};
