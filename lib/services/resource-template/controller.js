'use strict';

var Controller = function() {
  this.db = null;
};

Controller.prototype.scheme = {
  %name%: {
    table: '%name%s'
    // indexes: [ 'name' ]
  }
};

Controller.prototype.unitInit = function(units) {
  this.db = units.require('db');

  this.table = this.scheme.%name%.table;
};

Controller.prototype.get = function(id) {
  return this.db.get(this.box, id);
};


module.exports = Controller;
