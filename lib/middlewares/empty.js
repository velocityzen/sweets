'use strict';

module.exports = function(req, res, next) {
  if (!req.body) {
    req.body = {};
  }

  next();
};
