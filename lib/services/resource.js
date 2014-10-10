'use strict';
var path = require('path');
var fs = require('fs');
var Q = require('queueue');
var log = require('./log');

var rxJson = /\.json$/;

var Resource = function(units) {
	this.units = units;
};

Resource.prototype.loadContent = function(files, cb) {
	if(typeof files === "function") {
		cb = files;
		files = 'content';
	} else {
		files = [files];
	}

	var dir;
	this.q = new Q(1)
		.bind(this)
		.on("drain", cb);

	if(typeof files === "string") {
		dir = path.join(process.cwd(), files);
		files = fs.readdirSync(dir);
	} else {
		dir = process.cwd();
	}

	for(var f in files) {
		var filename = files[f];

		if(!rxJson.test(filename)) {
			continue;
		}

		if(filename[0] !== "/") {
			filename = path.join(dir, filename);
		}

		this.q.push({
			method: "parseJson",
			args: [filename]
		});
	}

	this.q.run();
};

Resource.prototype.parseJson = function(filename, cb) {
	var q = this.q,
		units = this.units;

	fs.readFile(filename, function(err, data) {
		var json = JSON.parse(data);

		for(var resource in json) {
			var	ctrl = units.require("resources." + resource + ".controller"),
				content = json[resource];

			q.push({
				method: "logGroup",
				args: [filename + " >> " + resource]
			});

			for (var i in content) {
				q.push({
					method: "insertContent",
					args: [ctrl, content[i]]
				});
			}

		}

		cb();
	});
};

Resource.prototype.logGroup = function(groupName, cb) {
	log.group(groupName);
	cb();
};

Resource.prototype.insertContent = function(ctrl, content, cb) {
	ctrl.create(content, function (err, res) {
		if(!err) {
			console.log(res[0] || res.id);
		} else {
			console.log(err);
		}
		cb();
	});
};

module.exports = Resource;
