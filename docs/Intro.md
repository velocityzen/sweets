# Sweets
Next Web builder toolkit

## Features

* Modular
* Lightweight
* Open source
* Multilanguage support
* Focused on RESTful api creation
* Auto api routing generation
* Database independent
* Builded-in authentication with user's roles

* Client [lib](http://github.com/swts/swts) (but you can use your own)
* Follows [UnionAPI](http://unionapi.org) recommendation
* JSON all the time
* API testing UI
* No ORM

## Sweets (modules)
Sweet is abstraction for one task.
[Here list of ready to use sweets](https://github.com/swts/sweets/blob/master/docs/sweets.md)

## Install

Best way to try sweets is to clone [sample app](https://github.com/swts/sample). and follow instruction from there.

Also all sweets available through npm.

## App architecture
Based on [apis](https://github.com/dimsmol/apis) lib
### Units
For more info look in [units documentation](https://github.com/dimsmol/units)
### Contracts
Contracts is for routing. But unlike the other frameworks contracts validate incoming data. And can validate *outcoming* data. All resources' contracts generate once at app launch.

For example look into [sample app](https://github.com/swts/sample).
More documentation will be availeble soon.

### Db
Db is optional for sweets app. You can make an app completely without db. But if you need db, you just set sweet db in settings and your db will be available as `db` unit. For example [nougat](https://github.com/swts/nougat) add support for great document based [rethinkdb](http://www.rethinkdb.com).

### Resource
[Resource description](https://github.com/swts/sweets/blob/master/docs/resource.md)

### Templates
todo

## Usage
###Comands
    bin/sweets command

####Commands for control sweets in a deamon mode:
**start**,
**stop**,
**restart**

####Commands useful while developing:
**worker**
— running one instance of app

**console**
— console with loaded app

###Services
    bin/sweets service command

####Db:
**db create**
— creates database.

**db drop**
— drops database

**db updateScheme** [sweetname]
— updates db scheme for all application or for one sweet

**db dropScheme** [sweetname]
— drops db scheme for all application or for one sweet

####Resource
**resource loadContent** [filename]
— load content from content/*.json or from certain file

####User:
**user create** email password [role]
- creates user

## Settings
**db**
— optional. Object contains sweet to load as db driver and other db settings dependent from db driver. Example:
```js
db = {
    sweet: "nougat",
    name "dbname"
}
```
Database sweet available as `"db"` unit.

**sweets**
— optional. An array of sweets names that should load on start. All units, resources and contracts will be created automatically.

Resources available as `"resources.resourcename"` units.

**templatePath**
— full path to templates

**mediaPath**
— full path to media direcory. Usually contains different media files, that don't have to be accessible from the web.

**staticPath**
— full path to static files dir

**errorsTemplate**
— errors template file name. Precompiled template will be available as `core.template.errors` unit.

**roles**
— optional. An array of roles in descending permissions order.
```js
roles = ["root", "editor", "user"]
```

**You can add your own settings if you needed to. They will be accessible in `core.settings` unit**

## Auth
Default sweet auth handler provides simple authentication for user resource. All authentication data saved in auth object in user resource. For authenticate user just call `/auth/user` with data: 
```
{
    email: "user@email.co",
    password: "password"    
}
```

If settings provides roles, auth handler will check user's permissions to use methods of resources.
