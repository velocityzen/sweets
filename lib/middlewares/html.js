'use strict';

module.exports = function(req, res, next) {
  res.set('Content-Type', 'text/html; charset=utf-8');
  next();
};
