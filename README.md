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

Build-in services:
### db
*   `create`
*   `drop`
*   `updateScheme [resource]`
*   `dropScheme [resource]`
*   `rebuildIndexes [resource]`

### resource
*   `create <resource>`
*   `loadContent [jsonfilename]`

### user
*   `create <id> <password> [role]`


## License
The GPLv3 License, see the included LICENSE.md file.
