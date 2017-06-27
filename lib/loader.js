'use strict';
const inherits = require('util').inherits;
const MMLoader = require('matter-in-motion').Loader;

const Loader = function(options) {
  MMLoader.call(this, options);
  this.services = {};
  this.addServices([ 'sweets.resource', 'sweets.service' ]);
};
inherits(Loader, MMLoader);

Loader.prototype.addServices = function(services) {
  const ss = this.services;
  for (let i in services) {
    const s = services[i].split('.');

    if (s[1]) {
      ss[ s[1] ] = s[0];
    } else {
      ss[ s[0] ] = true; //local app services
    }
  }
};

Loader.prototype.getSupportedCommands = function() {
  const cmds = Loader.super_.prototype.getSupportedCommands.call(this);
  return cmds.concat(Object.keys(this.services));
};

Loader.prototype.run = function(cmd) {
  if (!this.runCmd(cmd)) {
    const mod = this.services[cmd || this.args._[0]];

    if (!mod) {
      this.printUsageAndExit();
    }

    const w = this.getWorker();
    const args = [ mod ].concat(this.args._);
    !w.runService.apply(w, args) && this.printUsageAndExit();
  }
};

module.exports = Loader;
