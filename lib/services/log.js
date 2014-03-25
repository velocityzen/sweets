"use strict";

var group = function(groupName) {
	console.log('\x1B[32m\x1B[1m' + groupName +'\x1B[22m\x1B[39m');
};

var error = function(err) {
	console.log('\x1B[31m\x1B[1mERROR >\x1B[22m\x1B[39m', err);
};

var result = function(result) {
	console.log('\x1B[32m\x1B[1mOK >\x1B[22m\x1B[39m', result);
};

var progress = function(err, res) {
	if(err) {
		error(err.msg);
	} else {
		result(res);
	}
};

var done = function(err, res) {
	if(err) {
		error(err.msg);
		console.log('');
	} else {
		res && result(res);
		console.log('\x1B[32m\x1B[1mDONE\x1B[22m\x1B[39m\n');
	}
	process.exit();
};


module.exports = {
	progress: progress,
	group: group,
	done: done
};
