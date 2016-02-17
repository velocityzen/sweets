# Sweets
Flexible declarative web framework for real-time projects

## Features

* Focused on realtime RPC and events
* Declarative api
* No ORM
* Modular
* Fast and lightweight (startup time ~500ms)
* JSON all the time

## Install

The best way to try Sweets is to clone [sample app](https://github.com/swts/sample) and follow the instruction from there.

All Sweets modules are also available through npm.

## Usage
###Comands
    bin/sweets [options] command

####Options
**`--env=<envname>`** — overide environment settings.

####Commands to control the Sweets app in the deamon mode:
**start**,
**stop**,
**restart**

####Commands useful for developing:
**worker** — starts one instance of the app

**console** — starts the console with the loaded app

## App architecture
Based on [matter-in-motion](https://github.com/velocityzen/matter-in-mottion) lib

### Units
For more info look into [units documentation](https://github.com/dimsmol/units)

### Contracts
Contracts are for routing. They are fully compatible with expressjs.

For example, look into [sample app](https://github.com/swts/sample).
More documentation will be available soon.

### Database
Database is optional for the Sweets app. You can create an app completely without database. But if you need database, you just define the Sweets database module in settings and your database will be available as a `db` unit. For example, [nougat](https://github.com/swts/nougat) adds support for nosql [rethinkdb](http://www.rethinkdb.com).

## Settings and Environments
You can define environment as:
* `MM_ENV` environment variable
* `--env=<name>` cli option

if the Sweets App finds any environment defined, it will try to load a `environment.js` file from the settings directory. For example, `--env=dev` loads `dev.js`:

```js
"use strict";
module.exports = function (settings) {
    settings.core.debug = true;
    settings.core.web.listen.address = "0.0.0.0";
};
```

## Sweets (modules)
A sweet is an abstraction for one task.
[Here is the list of ready-to-use sweets](https://github.com/swts/sweets/blob/master/docs/sweets.md)

## Resource
[Resource docs](https://github.com/swts/sweets/blob/master/docs/Resource.md)

## Services
Services is a command line interface. You can run services as
`bin/sweets service command argument`

### Build-in services:
#### db
*   `create` — creates db with a name from the settings
*   `drop` — drops db
*   `updateScheme [resource]` — updates the scheme for all resources or just one.
*   `dropScheme [resource]` — drops the scheme for all resources or just one.
*   `rebuildIndexes [resource]` — rebuilds indexes for all resources or just one.

#### resource
*   `create <resource>` — creates a new resource in the `lib/resources` folder
*   `loadContent [jsonfilename]` — loads the content from all json files in the data folder except files begin with '_' underscore, or from a file.

#### user
*   `create <id> <password>` — creates a user with `id` and `password`. For default `sweets` auth provider `id` is an email.

#### service
*   `create <name>` — creates custom service. For details see **Custom services**.

### Custom services
To create a new service use the `service create <name>` service command. It makes *services/name.js* file. This is a simple class and every method can be run as `bin/sweets servicename methodname arg1 arg2 ...`. All methods get a callback as the last argument. Run this callback when the service is finished.
To make a service available for cli add it in the loader of your app:
```js
let Loader = function (options) {
    SweetsLoader.call(this, options);
    this.addServices([
      'nougat.db',
      'lollipop.user'
    ]);
};
```

## License
MIT License
