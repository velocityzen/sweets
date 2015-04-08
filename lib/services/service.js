"use strict";
let path = require("path");
let fs = require("fs");
let mkdirp = require("mkdirp");
let log = require("./log");

let Service = function() {
	this.path = path.join(process.cwd(), "lib", "services");
};

Service.prototype.create = function(service, cb) {
	let self = this,
		className = service;

	mkdirp(this.path, function(err) {
		if(err) {
			log.error(err);
		} else {
			fs.readFile(path.join(__dirname, "service-template", "service.js"), {encoding: "utf8"}, function(err, data) {
				if(err) {
					log.error(err);
				} else {
					data = data.replace(/%name%/gm, className[0].toUpperCase() + className.slice(1));
					fs.writeFile(path.join(self.path, service + ".js"), data, {flag: "wx"}, function(err) {
						if(err) {
							if(err.code === "EEXIST") {
								log.error("It seems that '" + service + "' service already exists");
							} else {
								console.log(err);
							}
						}
						cb();
					});
				}
			});
		}
	});
};


module.exports = Service;
