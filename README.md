# Sweets
Flexible declarative web framework for real-time projects

## Features

* Focused on RESTful api
* Auto api routing generation
* No ORM
* Modular
* Lightweight
* JSON all the time
* API testing UI

## Sweets (modules)
Sweet is abstraction for one task.
[Here list of ready to use sweets](https://github.com/swts/sweets/blob/master/docs/sweets.md)

## Install

Best way to try sweets is to clone [sample app](https://github.com/swts/sample) and follow instruction from there.

Also all sweets available through npm.

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
*   `loadContent [jsonfilename]` — loads content from all json files in a content folder or from file.

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
The GPLv3 License, see the included LICENSE.md file.
