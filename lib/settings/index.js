"use strict";
var inherits = require('util').inherits;
var apis = require('apis');

var Settings = function() {
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

	this.core.auth.providers.sweets = {
		signer: {
			secrets: {
				a: 'Everything in this room is edible. Even I\'m edible. But, that would be called canibalism. It is looked down upon in most societies.',
				b: 'Oh, my sainted aunt! Don\'t mention that disgusting stuff in front of me! Do you know what breakfast cereal is made of? It\'s made of all those little curly wooden shavings you find in pencil sharpeners!'
			},
			currentKey: 'a'
		},
		adapter: 'main'
	};

	this.roles = ["root", "editor", "author"];
};


module.exports = Settings;