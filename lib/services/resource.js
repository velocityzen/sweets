'use strict';
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var Q = require('queueue');
var log = require('./log');

var rxJson = /\.json$/;

var Resource = function(units) {
	this.units = units;
	this.q = new Q(1).bind(this);
};

Resource.prototype.create = function(resource, cb) {
	var q = this.q,
		name = resource.split("/"),
		resPath = path.join(process.cwd(), 'lib', 'resources', name.join("-")),
		ctx = {
			resource: resource,
			name: name[name.length-1]
		};

	mkdirp(resPath, function(err, made) {
		if(err) {
			log.error(err);
		} else if(!made) {
			log.error("It seems like '"+ resource +"' resource already exists");
			cb();
		} else {
			q.on("drain", cb);
			["api.js", "controller.js", "request.js", "response.js", "roles.js", "units.js"].forEach(function(filename) {
				q.push({
					method: "copyTemplate",
					args: [
						path.join(__dirname, "resource-template", filename),
						path.join(resPath, filename),
						ctx
					]
				});
			});
		}
	});
};

Resource.prototype.copyTemplate = function(from, to, ctx, cb) {
	fs.readFile(from, {encoding: 'utf8'}, function(err, data) {
		if(err) {
			log.error(err);
		} else {
			data = data.replace(/%resource%/gm, ctx.resource).replace(/%name%/gm, ctx.name);
			fs.writeFile(to, data, function(err) {
				if(err) {
					console.log(err);
				}
				cb();
			});
		}
	});
};

Resource.prototype.loadContent = function(files, cb) {
	if(typeof files === "function") {
		cb = files;
		files = 'content';
	} else {
		files = [files];
	}

	var dir;
	this.q.on("drain", cb);

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
		try {
			var json = JSON.parse(data);

			for(var resource in json) {
				var	ctrl = units.get("resources." + resource + ".controller");

				if(ctrl) {
					var content = json[resource];

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
				} else {
					log.error("Error parsing file " + filename + ':\n' + "There is no resource \"" + resource + "\"");
				}
			}
		} catch(e) {
			log.error("Error parsing file " + filename + ':\n' + e);
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
