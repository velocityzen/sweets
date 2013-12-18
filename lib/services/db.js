"use strict";
var fs = require('fs');
var path = require('path');
var async = require('async');
var progress = require('./out').progress;
var done = require('./out').done;

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

	console.log(files);
	if(typeof files === "string") {
		dir = path.join(process.cwd(), files);
		files = fs.readdirSync(dir);
	} else {
		dir = process.cwd();
	}

	console.log(dir, files);

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
