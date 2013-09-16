"use strict";
var fs = require('fs');
var path = require('path');
var async = require('async');

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

var updateSchemeTask = function(db, module, scheme) {
	return function(cb) {
		db.applyScheme(scheme, progress(module), cb);
	};
};

var updateScheme = function (db, modules) {
	var q = [], scheme;

	for(var m in modules) {
		scheme = modules[m].scheme;

		if(scheme) {
			q.push(updateSchemeTask(db, m, scheme));
		}
	}

	async.parallel(q, done);
};

var loadContentTask = function(db, table, content, cbEach) {
	return function(cb) {
		db.create(table, content, function(err, result) {
			if(!err) {
				cbEach(result);
			}
			cb(err, result);
		});
	};
};

var loadContent = function (db, files) {
	var q = [], dir;

	if(typeof files === "string") {
		dir = path.join(process.cwd(), files);
		files = fs.readdirSync(dir);
	} else {
		dir = process.cwd();
	}

	for(var f in files) {
		var fileName = files[f];

		if(fileName[0] !== "/") {
			fileName = path.join(dir, fileName);
		}

		var json = JSON.parse(fs.readFileSync(fileName));

		for(var table in json) {
			q.push( loadContentTask(db, table, json[table], progress(fileName + " > "+table)) );
		}
	}

	async.series(q, done);
};

module.exports = {
	updateScheme: updateScheme,
	loadContent: loadContent
};