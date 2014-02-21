'use strict';
var path = require('path');
var fs = require('fs');
var async = require('async');
var log = require('./log');

var Resource = function(units) {
	this.units = units;
};

Resource.prototype.loadContent = function(files, cb) {
	var q = [], dir;

	if(typeof files === "function") {
		cb = files;
		files = 'content';
	} else {
		files = [files];
	}

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

		for(var resource in json) {
			q = q.concat( this.loadResourceContentTasks(resource, json[resource], fileName + " >> " + resource) );
		}
	}

	async.series(q, cb);
};

Resource.prototype.loadResourceContentTasks = function (resource, content, groupName) {
	var resourceCtrl = this.units.require("resources." + resource + ".controller"),
		tasks = [function (cb) {
			log.group(groupName);
			cb(null);
		}];

	content.forEach(function(element, index) {
		tasks.push(function(cb) {
			resourceCtrl.create(element, function (err, result) {
				if(!err) {
					console.log(result.generated_keys[0]);
				}
				cb(err, result);
			});
		});
	});

	return tasks;
};

module.exports = Resource;
