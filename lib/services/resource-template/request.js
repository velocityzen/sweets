'use strict';
let v = require('../validators');

let Request = function() {};

Request.prototype.unitInit = function(units) {};

Request.prototype.get = function() {
  return {
    id: v.uuid
  };
};

Request.prototype.create = function() {
  return v.any;
};

Request.prototype.update = function() {
  return {
    id: v.uuid,
    to: v.any
  };
};

Request.prototype.del = function() {
  return {
    id: v.uuid
  };
};

module.exports = Request;
