"use strict";
let path = require("path");
let fs = require("fs");
let mkdirp = require("mkdirp");
let Q = require("queueue");
let log = require("./log");

let rxJson = /\.json$/;

let Resource = function(units) {
	this.units = units;
	this.q = new Q(1).bind(this);
};

Resource.prototype.create = function(resource, cb) {
	let q = this.q,
		name = resource.split("/"),
		resPath = path.join(process.cwd(), "lib", "resources", name.join("-")),
		ctx = {
			resource: resource,
			name: name[name.length - 1]
		};

	mkdirp(resPath, function(err, made) {
		if(err) {
			log.error(err);
		} else if(!made) {
			log.error("It seems that '" + resource + "' resource already exists");
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
	fs.readFile(from, {encoding: "utf8"}, function(err, data) {
		if(err) {
			log.error(err);
		} else {
			data = data.replace(/%resource%/gm, ctx.resource).replace(/%name%/gm, ctx.name);
			fs.writeFile(to, data, function(err) {
				err && log.error(err);
				cb();
			});
		}
	});
};

Resource.prototype.loadContent = function(files, cb) {
	if(typeof files === "function") {
		cb = files;
		files = "data";
	} else {
		files = [files];
	}

	let dir;
	this.q.on("drain", cb);

	if(typeof files === "string") {
		dir = path.join(process.cwd(), files);
		try {
			files = fs.readdirSync(dir);
		} catch(e) {
			if(e.code === "ENOENT") {
				cb(new Error("There is no 'data' directory."))
			}
		}
	} else {
		dir = process.cwd();
	}

	for(let f in files) {
		let filename = files[f];

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

	if(!this.q.length()) {
		cb(null, "No data files");
	}
};

Resource.prototype.parseJson = function(filename, cb) {
	let q = this.q,
		units = this.units;

	fs.readFile(filename, function(err, data) {
		if(err) {
			log.error(err);
		} else {
			try {
				let json = JSON.parse(data);

				for(let resource in json) {
					let	ctrl = units.get("resources." + resource + ".controller");

					if(ctrl) {
						let content = json[resource];

						q.push({
							method: "logGroup",
							args: [filename + " >> " + resource]
						});

						for (let i in content) {
							q.push({
								method: "insertContent",
								args: [ctrl, content[i]]
							});
						}
					} else {
						log.error("Error parsing file " + filename + ":\n" + "There is no resource \"" + resource + "\"");
					}
				}
			} catch(e) {
				log.error("Error parsing file " + filename + ":\n" + e);
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
