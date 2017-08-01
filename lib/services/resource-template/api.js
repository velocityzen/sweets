'use strict';
const Api = function() {
  this.calls = [ 'get' ];
};

Api.prototype.__init = function(units) {
  this.ctrl = units.require('controller');
};

Api.prototype.get = function() {
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
    },

    call: (auth, data, cb) => this.ctrl
      .get(data.id)
      .asCallback(cb)
  }
};


module.exports = Api;
