'use strict';

var Controller = function() {
  this.db = null;
};

Controller.prototype.box = '%name%s';
//Controller.prototype.scheme = { indexes: [] };

Controller.prototype.unitInit = function(units) {
  this.db = units.require('db');
};

Controller.prototype.get = function(id) {
  this.db.get(this.box, id);
};


module.exports = Controller;
