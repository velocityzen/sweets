'use strict';
const Api = require('./api');
const Controller = require('./controller');

module.exports = () => ({
  api: new Api(),
  controller: new Controller()
});
