'use strict';
let Api = function() {};

Api.prototype.unitInit = function(units) {
  this.ctrl = units.require('controller');
};

Api.prototype.calls = [ 'get' ];

Api.prototype.getSchema = function() {
  return {
    auth: {
      provider: 'user',
      required: 'optional'
    },
    title: '%name%',
    description: 'Returns %name%',
    request: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        }
      },
      required: [ 'id' ],
      additionalProperties: false
    }
  }
};

Api.prototype.get = function(auth, data, cb) {
  this.ctrl
    .get(data.id)
    .asCallback(cb);
};


module.exports = Api;
