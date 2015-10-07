'use strict';
let path = require('path');
let UnitSet = require('units').UnitSet;
let inherits = require('util').inherits;
let SuperApp = require('apis/lib/app');

let App = function(options) {
  SuperApp.call(this, options);
  this.sweetsPath = path.join(process.cwd(), 'node_modules');
};
inherits(App, SuperApp);

App.prototype.addUnits = function() {
  let units = this.units;
  let settings = units.require('core.settings');
  let debug = settings.core.debug;

  settings.auth && this.loadAuth(settings.auth);
  settings.db && this.loadDbSweet(settings.db, debug);
  settings.cache && this.loadCacheSweet(settings.cache, debug);
  settings.template && this.loadTemplateSweet(settings.template, debug);

  this.loadResources(settings.resources);
};

App.prototype.getSweet = function(sweetName) {
  return require(path.join(this.sweetsPath, 'sweets-' + sweetName));
};

App.prototype.loadAuth = function(Auth) {
  if (Auth === true) {
    Auth = require('apis/lib/auth/auth_unit');
  }

  let units = new UnitSet();
  units.add('~', new Auth());
  this.units.addSet('auth', units);
};

App.prototype.loadDbSweet = function(options) {
  let DbUnit = require('./db');
  let DbClass = this.getSweet(options.sweet);
  let dbInstance = new DbClass(options.options);
  this.units.add('db', new DbUnit(dbInstance));
};

App.prototype.loadTemplateSweet = function(options, debug) {
  let self = this;
  let env = this.getSweet(options.sweet)(options.options, debug);

  if (options.extensions) {
    options.extensions.forEach(function(extName) {
      let ext = self.getSweet(extName);
      env = ext(env, debug);
    });
  }

  this.units.expose('core.template', env);

  if (options.options.errorsTemplate) {
    let errorsTemplate = env.getTemplate(options.options.errorsTemplate, true);
    this.units.expose('core.template.errors', errorsTemplate);
  }
};

App.prototype.loadCacheSweet = function(options) {
  let Cache = this.getSweet(options.sweet);
  let cache = new Cache(options);

  this.units.expose('core.cache', {
    cache: function(ns) {
      return cache ? cache.getCache(ns) : false;
    }
  });
};

App.prototype.loadResources = function(sweetResources) {
  let resUnitSet = new UnitSet();

  let resModuleUnitSet;
  for (let i in sweetResources) {
    resModuleUnitSet = this.getSweet(sweetResources[i]);
    resUnitSet.joinSet(resModuleUnitSet());
  }

  try {
    let resLocalUnitSet = require(path.join(process.cwd(), 'lib', 'resources', 'units'));
    resUnitSet.joinSet(resLocalUnitSet());
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }
  }

  this.units.addSet('resources', resUnitSet);
};

//service
App.prototype.runService = function(serviceName, serviceCommand) {
  this.ensureInited();
  let done = require('./services/log').done;
  let Service;

  try {
    Service = require(path.join(process.cwd(), 'lib', 'services', serviceName));
  } catch (e) {
    Service = require('./services/' + serviceName);
  }

  if (Service) {
    let service = new Service(this.units);
    let args = [].slice.call(arguments, 2);

    if (service[serviceCommand]) {
      args.push(done);
      service[serviceCommand].apply(service, args);
    } else {
      done(new Error(`{serviceName} doesn't have a '{serviceCommand}' command`));
    }
  } else {
    done(new Error('Service not found'));
  }
};


module.exports = App;
