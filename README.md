# Sweets
Flexible declarative web framework for real-time projects

## Features

* Focused on RESTful api
* Auto api routing generation
* No ORM
* Modular
* Lightweight (startup time ~300ms)
* JSON all the time

## Install

Best way to try sweets is to clone [sample app](https://github.com/swts/sample) and follow instruction from there.

Also all sweets available through npm.

## Usage
###Comands
    bin/sweets [options] command

####Options
**`--env=<envname>`** — overide environment settings.

####Commands for control sweets in a deamon mode:
**start**,
**stop**,
**restart**

####Commands useful while developing:
**worker**
— running one instance of app

**console**
— console with loaded app

## App architecture
Based on [apis](https://github.com/velocityzen/apis) lib

### Units
For more info look in [units documentation](https://github.com/dimsmol/units)
### Contracts
Contracts is for routing. But unlike the other frameworks contracts validate incoming data. And can validate *outcoming* data. All resources' contracts generate once at app launch.

For example look into [sample app](https://github.com/swts/sample).
More documentation will be availeble soon.

### Database
Db is optional for sweets app. You can make an app completely without db. But if you need db, you just set sweet db in settings and your db will be available as `db` unit. For example [nougat](https://github.com/swts/nougat) add support for great document based [rethinkdb](http://www.rethinkdb.com).

## Environment
You can define environment as:
* `SWEETS_ENV` environment variable
* `--env=dev` cli option

if sweets found any environment defined it will try to load a `environment.js` file from settings directory. Simple example of `dev.js`

```js
"use strict";
module.exports = function (settings) {
    settings.core.debug = true;
    settings.core.web.listen.address = "0.0.0.0";
};
```

## Sweets (modules)
Sweet is abstraction for one task.
[Here list of ready to use sweets](https://github.com/swts/sweets/blob/master/docs/sweets.md)

## Resource
[Resource docs](https://github.com/swts/sweets/blob/master/docs/Resource.md)

## Services
Services is a command line interface. You can run services as 
`bin/sweets service command argument`

### Build-in services:
#### db
*   `create` — creates db with name from settings
*   `drop` — drops db
*   `updateScheme [resource]` — updates scheme for all resources or just one.
*   `dropScheme [resource]` — drops scheme for all resources or just one.
*   `rebuildIndexes [resource]` — rebuilds indexes for all resources or just one.

#### resource
*   `create <resource>` — creates a resource from template in a lib/resources folder
*   `loadContent [jsonfilename]` — loads content from all json files in the data folder or from a file.

#### user
*   `create <id> <password> [role]` — creates user with id. For default sweets auth provider id is an email.

#### service 
*   `create <name>` — creates custom service. For details see **Custom services**.

### Custom services
To create a new service use the `service create <name>` service command. It makes *services/name.js* file. This is a simple class and every method can be run as `bin/sweets servicename methodname arg1 arg2 ...`. All methods get a callback as the last argument. Run this callback when the service is finished.
To make service available for cli add it in the loader of your app:
```js
var Loader = function (options) {
    SweetsLoader.call(this, options, ["your_service_name", "another_custom_service"]);
};
```

## License
MIT License
