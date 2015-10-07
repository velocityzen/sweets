'use strict';
let inherits = require('util').inherits;
let apis = require('apis');

let Settings = function() {
  apis.Settings.call(this);
};
inherits(Settings, apis.Settings);

Settings.prototype.init = function() {
  Settings.super_.prototype.init.call(this);

  this.core.auth.algoMaps = {
    signer: {
      sha1: 'sweet'
    }
  };

  this.core.auth.providers.user = {
    signer: {
      secrets: {
        a: 'Everything in this room is edible. Even I\'m edible. But, that would be called canibalism. It is looked down upon in most societies.',
        b: 'Oh, my sainted aunt! Don\'t mention that disgusting stuff in front of me! Do you know what breakfast cereal is made of? It\'s made of all those little curly wooden shavings you find in pencil sharpeners!'
      },
      currentKey: 'a'
    },

    crypter: {
      secrets: {
        a: 'You should never, never doubt something that no one is sure of.',
        b: 'I am the maker of music, the dreamer of dreams!'
      },
      currentKey: 'a'
    },

    adapter: 'main'
  };
};


module.exports = Settings;
