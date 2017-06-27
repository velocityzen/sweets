'use strict';
const path = require('path');
const inherits = require('util').inherits;
const MMApp = require('matter-in-motion').App;

const App = function(options) {
  MMApp.call(this, options);
  this.sweetsPath = path.join(process.cwd(), 'node_modules');
};
inherits(App, MMApp);

App.prototype.addUnits = function() {
  const units = this.units;
  const settings = units.require('core.settings');
  this.debug = settings.core.debug;
  settings.db && this.addSweetDb(settings.db);
  settings.cache && this.addSweetCache(settings.cache);
  settings.template && this.addSweetTemplate(settings.template);
  this.addResources(settings.resources);
};

App.prototype.getSweet = function(name) {
  return require(path.join(this.sweetsPath, 'sweets-' + name));
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

App.prototype.addResources = function(sResources) {
  sResources && sResources.forEach(sweet => {
    const sweetUnitSet = this.getSweet(sweet);
    this.units.add('resources', sweetUnitSet);
  });
  App.super_.prototype.addResources.call(this);
  return this;
};

//service
App.prototype.runService = function(module, name, cmd) {
  this.ensureInited();
  const log = require('./services/log');
  let servicePath;

  switch (module) {
    case true: //local
      servicePath = path.join(process.cwd(), 'lib', 'services', name);
      break;

    case 'sweets':
      servicePath = path.join(this.sweetsPath, 'sweets', 'lib', 'services', name);
      break;

    default: //sweets modules
      servicePath = path.join(this.sweetsPath, 'sweets-' + module, 'services', name);
  }

  const Service = this.loader.tryRequire(servicePath);

  if (!Service) {
    log.done(new Error('Service not found'));
    return;
  }

  const service = new Service(log, this.units);
  const args = [].slice.call(arguments, 3);

  if (service[cmd]) {
    let cb = args[args.length - 1];
    if (typeof cb !== 'function') {
      args.push(log.done);
    }
    service[cmd].apply(service, args);
  } else {
    log.done(new Error(`${name} doesn't have a '${cmd}' command`));
  }

  return true;
};


module.exports = App;
