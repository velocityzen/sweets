'use strict';
const Db = function(instance) {
  this.instance = instance;
};

Db.prototype.__initRequired = true;

Db.prototype.__init = function() {};

Db.prototype.__instance = function() {
  return this.instance;
};


module.exports = Db;
