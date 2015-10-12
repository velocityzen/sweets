'use strict';

var Controller = function() {
  this.db = null;
};

Controller.prototype.box = '%name%s';
//Controller.prototype.scheme = { indexes: [] };

Controller.prototype.unitInit = function(units) {
  this.db = units.require('db');
};

Controller.prototype.get = function(id, cb) {
  this.db.get(this.box, id, cb);
};

Controller.prototype.create = function(data, cb) {
  this.db.insert(this.box, data, cb);
};

Controller.prototype.update = function(id, to, cb) {
  this.db.update(this.box, id, to, cb);
};

Controller.prototype.remove = function(id, cb) {
  this.db.remove(this.box, id, cb);
};

module.exports = Controller;
