'use strict';

module.exports = function(req, res, next) {
  req.body.path = req.path;
  next();
};
