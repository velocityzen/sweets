'use strict';
const path = require('path');
const inherits = require('util').inherits;
const MmSettings = require('matter-in-motion/lib/settings');

let Settings = function() {
  MmSettings.call(this);
};
inherits(Settings, MmSettings);

Settings.prototype.init = function() {
  Settings.super_.prototype.init.call(this);

  this.core.static = {
    url: '/static',
    root: path.join(this.core.root, '/static')
  }

  this.core.validator.removeAdditional = 'all';
};


module.exports = Settings;
