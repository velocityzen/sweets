'use strict';
let path = require('path');
let fs = require('fs');
let mkdirp = require('mkdirp');
let Q = require('queueue');

let rxJson = /^[^_].*\.json$/;

let Resource = function(log, units) {
  this.log = log;
  this.units = units;
  this.q = new Q(1).bind(this);
};

Resource.prototype.create = function(resource, cb) {
  if (!cb) {
    this.log.error('Ouch! We need a resource name.');
    resource();
    return;
  }

  let log = this.log;
  let q = this.q;
  let name = resource.split('/');
  let resPath = path.join(process.cwd(), 'lib', 'resources', name.join('-'));
  let ctx = {
    resource: resource,
    name: name[name.length - 1]
  };

  mkdirp(resPath, function(err, made) {
    if (err) {
      log.error(err);
    } else if (!made) {
      log.error('It seems that \'' + resource + '\' resource already exists');
      cb();
    } else {
      q.on('drain', cb);
      [ 'api.js', 'controller.js', 'units.js' ].forEach(function(filename) {
        q.push({
          method: 'copyTemplate',
          args: [
            path.join(__dirname, 'resource-template', filename),
            path.join(resPath, filename),
            ctx
          ]
        });
      });
    }
  });
};

Resource.prototype.copyTemplate = function(from, to, ctx, cb) {
  var log = this.log;
  fs.readFile(from, { encoding: 'utf8' }, function(err, data) {
    if (err) {
      log.error(err);
    } else {
      data = data.replace(/%name%/gm, ctx.name);
      fs.writeFile(to, data, function(err) {
        err && log.error(err);
        cb();
      });
    }
  });
};

Resource.prototype.loadContent = function(files, cb) {
  let checkRx = true;
  if (typeof files === 'function') {
    cb = files;
    files = 'data';
  } else {
    files = [ files ];
    checkRx = false;
  }

  let dir;
  this.q.on('drain', cb);

  if (typeof files === 'string') {
    dir = path.join(process.cwd(), files);
    try {
      files = fs.readdirSync(dir);
    } catch (e) {
      if (e.code === 'ENOENT') {
        cb(new Error('There is no \'data\' directory.'));
      }
    }
  } else {
    dir = process.cwd();
  }

  for (let f in files) {
    let filename = files[f];

    if (checkRx && !rxJson.test(filename)) {
      continue;
    }

    if (filename[0] !== '/') {
      filename = path.join(dir, filename);
    }

    this.q.push({
      method: 'parseJson',
      args: [ filename ]
    });
  }

  if (!this.q.length()) {
    cb(null, 'No data files');
  }
};

Resource.prototype.parseJson = function(filename, cb) {
  let q = this.q;
  let units = this.units;
  let log = this.log;

  fs.readFile(filename, function(err, data) {
    if (err) {
      log.error(err);
    } else {
      try {
        let json = JSON.parse(data);

        for (let resource in json) {
          let ctrl = units.get('resources.' + resource + '.controller');

          if (ctrl) {
            let content = json[resource];

            q.push({
              method: 'logGroup',
              args: [ resource + ' << ' + content.length + ' documents from ' + filename ]
            });

            for (let i in content) {
              q.push({
                method: 'insertContent',
                args: [ ctrl, content[i] ]
              });
            }
          } else {
            log.error('Error parsing file ' + filename + ':\nThere is no resource \'' + resource + '\'');
          }
        }
      } catch (e) {
        log.error('Error parsing file ' + filename + ':\n' + e);
      }
    }
    cb();
  });
};

Resource.prototype.logGroup = function(groupName, cb) {
  this.log.group(groupName);
  cb();
};

Resource.prototype.insertContent = function(ctrl, content, cb) {
  ctrl.create(content, function(err, res) {
    if (!err) {
      console.log(res[0] || res.id);
    } else {
      console.log(err);
    }
    cb();
  });
};

module.exports = Resource;
