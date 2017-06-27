'use strict';
const Db = function(instance) {
  this.instance = instance;
};

Db.prototype.unitIsInitRequired = true;

Db.prototype.unitInit = function() {};

Db.prototype.unitGetInstance = function() {
  return this.instance;
};


module.exports = Db;
