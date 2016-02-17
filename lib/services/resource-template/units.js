'use strict';
let Api = require('./api');
let Controller = require('./controller');

module.exports = function() {
  return {
    api: new Api(),
    controller: new Controller()
  }
};
