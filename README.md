# Sweets
Next Web builder toolkit

## Features

* Modular
* Lightweight
* Follows [UnionAPI](http://unionapi.org) recommendation
* Focused on RESTful api creation
* Auto api routing generation
* No ORM
* JSON all the time
* API testing UI
* Database independent
* Builded-in authentication
* Client [lib](http://github.com/swts/swts) (but you can use your own)

## Sweets (modules)
Sweet is abstraction for one task.
[Here list of ready to use sweets](http://github.com/swts/sweets/sweets.md)

## Install

Best way to try sweets is to clone [sample app](http://http://github.com/swts/sample-app). and follow instruction from there.

Also all sweets available through npm.

## App architecture
### Units
For more info look in [units documentation](https://github.com/dimsmol/units)
### Contracts
### Db
### Resource

## Usage
    bin/sweets command

####Control sweets in deamon mode:
*start*,
*stop*,
*restart*

####Db operation:
*db_update_scheme* [sweetname]
— updates db scheme for all application or for one sweet

*db_load_content* [filename]
— load content from content/*.json or from certain file

~~*db_drop* [sweetname]
— drops database for all application or for one sweet~~

####User creation:
*create_user* email password [role]

####Developing:
*worker*
— running one instance of app

*console*
— console with loaded app

## Settings
*db*
— optional. Object contains sweet to load as db driver and other db settings dependent from db driver. Example:
```js
db = {
    sweet: "nougat",
    name "dbname"
}
```
Database sweet available as `"db"` unit.

*sweets*
— optional. An array of sweets names that should load on start. All units, resources and contracts will be created automatically.

Resources available as `"resources.resourcename"` units.

*staticPath*
— full path to static files dir

*templatePath*
— full path to templates

*roles*
— optional. An array of roles in descending permissions order.
```js
roles = ["root", "editor", "user"]
```

## Auth
Default sweet auth handler provides simple authentication for user resource. All authentication data saved in auth object in user resource. For authenticate user just call `/auth/user` with data: 
```
{
    email: "user@email.co",
    password: "password"    
}
```

If settings provides roles, auth handler will check user's permissions to use methods of resources.

[ ] add docs how to make custom auth handler
