'use strict';
let inherits = require('util').inherits;
let ApisLoader = require('apis/lib/loader');

let Loader = function(options, services) {
  ApisLoader.call(this, options);
  this.services = {};
  this.parseServices([ 'sweets.resource', 'sweets.service' ]);
  services && this.parseServices(services);
};
inherits(Loader, ApisLoader);

Loader.prototype.parseServices = function(services) {
  let ss = this.services;
  for (let i in services) {
    let s = services[i].split('.');

    if (s[1]) {
      ss[ s[1] ] = s[0];
    } else {
      ss[ s[0] ] = true; //local app services
    }
  }
};

Loader.prototype.getSupportedCommands = function() {
  return Loader.super_.prototype.getSupportedCommands().concat(this.services);
};

Loader.prototype.run = function(cmd) {
  if (cmd === undefined) {
    cmd = process.argv[2];
  }

  if (!this.services[cmd]) {
    Loader.super_.prototype.run.call(this, cmd);
  } else {
    let args = process.argv.slice(2);
    let w = this.getWorker();
    args.unshift(this.services[cmd]);
    w.runService.apply(w, args);
  }
};

module.exports = Loader;
