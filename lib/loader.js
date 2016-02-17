'use strict';
let inherits = require('util').inherits;
let MMLoader = require('matter-in-motion').Loader;

let Loader = function(options) {
  MMLoader.call(this, options);
  this.services = {};
  this.addServices([ 'sweets.resource', 'sweets.service' ]);
};
inherits(Loader, MMLoader);

Loader.prototype.addServices = function(services) {
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
  let cmds = Loader.super_.prototype.getSupportedCommands.call(this);
  return cmds.concat(Object.keys(this.services));
};

Loader.prototype.run = function(cmd) {
  if (!this.runCmd(cmd)) {
    let mod = this.services[cmd || this.args._[0]];

    if (!mod) {
      this.printUsageAndExit();
    }

    let w = this.getWorker();
    let args = [ mod ].concat(this.args._);
    !w.runService.apply(w, args) && this.printUsageAndExit();
  }
};

module.exports = Loader;
