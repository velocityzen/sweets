'use strict';
let UnitSet = require('units').UnitSet;
let Auth = require('./auth');

module.exports = function() {
  let units = new UnitSet();

  units.add('~', new Auth());

  return units;
};
