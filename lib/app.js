'use strict';
const inherits = require('util').inherits;
const MMApp = require('matter-in-motion').App;

const App = function(options) {
  MMApp.call(this, options);
};
inherits(App, MMApp);

App.prototype.willStart = function() {
  const units = this.units;
  const settings = units.require('core.settings');
  this.debug = settings.core.debug;
  settings.db && this.addSweetDb(settings.db);
  settings.cache && this.addSweetCache(settings.cache);
  settings.template && this.addSweetTemplate(settings.template);
  this.addSweets(settings.resources);
};

App.prototype.getSweet = function(name) {
  return this.require('sweets-' + name);
};

App.prototype.addSweetDb = function(options) {
  const DbUnit = require('./db');
  const DbClass = this.getSweet(options.sweet);
  const dbInstance = new DbClass(options.options);
  this.units.add('db', new DbUnit(dbInstance));
};

App.prototype.addSweetTemplate = function(options) {
  let env = this.getSweet(options.sweet)(options.options, this.debug);

  if (options.extensions) {
    options.extensions.forEach((extName) => {
      const ext = this.getSweet(options.sweet + '-' + extName);
      env = ext(env, this.debug);
    });
  }

  this.units.expose('core.template', env);

  if (options.options.errorsTemplate) {
    const errorsTemplate = env.getTemplate(options.options.errorsTemplate, true);
    this.units.expose('core.template.error', errorsTemplate);
  }
};

App.prototype.addSweetCache = function(options) {
  const Cache = this.getSweet(options.sweet);
  const cache = new Cache(options);

  this.units.expose('core.cache', {
    cache: function(ns) {
      return cache ? cache.getCache(ns) : false;
    }
  });
};

App.prototype.addStatic = function(opts) {
  this.debug && App.super_.prototype.addStatic.call(this, opts);
  return this;
};

App.prototype.addSweets = function(sResources) {
  sResources && sResources.forEach(sweet => {
    const sweetUnitSet = this.getSweet(sweet);
    this.units.add('resources', sweetUnitSet);
  });
  return this;
};


module.exports = App;
