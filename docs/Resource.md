# Sweet resource

**If you don't know what a unit is, read *[units chapter](http://link to chapt)* first.**

```
resourceName/
    request.js      - unit, requests validators
    response.js     — unit, response validators, can be omitted
    api.js          - unit, api requests handlers
    controller.js   - unit, resource logic and db interaction
    roles.js        - roles for api requests. can be omitted
    defaults.js     — default settings for resource.
```

### Request and response
Request and response validators generators is a simple unit with *at least one*request method validator. Response validators are optional but very useful for testing purposes.

**Sweets uses request methods to generate a contract. If a resource has a request with only `get` and `create` generators, the contract will have only those methods.**

Available methods: `get`, `create`, `update`, `del`, `call`

Default authentication requirement for all methods is "required" except `get`. For `get` the authentication is "optional".

For validators Sweets uses the most powerful [valid](https://github.com/dimsmol/valid) lib and [sweets-valid](https://github.com/swts/valid) extension.

Simple user validator example:
```js
"use strict";
let v = require("sweets-valid");

let Request = function () {
    //do something here
};

Request.prototype.unitInit = function(units) {
    this.roles = units.require("core.settings").roles;
};

Request.prototype.auth = {
    create: "none"
};

Request.prototype.get = function() {
    return { id: v.uuid };
};

Request.prototype.create = function() {
    let validator = {
            email: v.email,
            password: v.str,
            name: v.opt(v.str)
        };

    if(this.roles) {
        validator.role = v.opt(v.oneOf.apply(null, this.roles));
    }

    return validator;
};

Request.prototype.update = function() {
    let validator = {
            to: {
                name: v.opt(v.str),
                password: v.opt(v.str)
            }
        };

    if(this.roles) {
        validator.to.role = v.opt(v.oneOf.apply(null, this.roles));
    }

    return validator;
};

Request.prototype.del = function() {
    return { id: v.uuid };
};

module.exports = Request;
```

For `request` unit you can also define an auth object with `methods` properties to change the default authentication in the resource contract:

```js
request.auth = {
    create: "none",
    del: "required"
}
```


### api
Api is a unit class for interaction with outer space. 

* **No db interaction here.** Api uses only controllers methods.
* Api returns conforming http error codes if error occurs. There is an easy-to-use error handler from [apis-return](https://github.com/velocityzen/apis-return) module.

####Properties and methods:
`name` — resource name. Ex. `"user"`, `"blog/post"`. Resource api will be available under this name `"/api/1/user"` and `"api/1/blog/post"`.

`get`, `create`, `update`, `del` — methods for handling various types of requests.

Example for resource **user**:

```js
"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;

var errors = require('apis-return');
var Forbidden = errors.Forbidden;
var Conflict = errors.Conflict;
var returnHandler = errors.handler;

var User = function () {
    this.ctrl = undefined;
};
inherits(User, Unit);

//resource name.
User.prototype.name = 'user';

User.prototype.unitInit = function (units) {
    this.ctrl = units.require('controller');
};

User.prototype.get = function (auth, requestData, cb) {
    if(requestData) {
        //if there is a request with email, return the user profile or 404 error
        this.ctrl.get(requestData.email, returnHandler("NotFound", "user", cb));
    } else if(!auth) {
        //if there is an empty request and no auth identity, return the 403 error
        cb(new Forbidden());
    } else {
        //finaly, if there is an empty request but there is an auth.identity, return the authenticated user profile or 400 error if that user doesn't exist
        this.ctrl.get(auth.identity.email, returnHandler("BadRequest", "user", cb));
    }
};

User.prototype.create = function (auth, requestData, cb) {
    var self = this;

    this.ctrl.create(requestData, function(err, result) {
        if(err) {
            //Error code 2 means a dublicate record (there is a user with the same email)
            if(err.code === 2) {
                cb(new Conflict());
            } else {
                cb(err);
            }
        } else {
            cb(null, {created: requestData.email});
        }
    });
};

User.prototype.update = function (auth, requestData, cb) {
    //...
};

User.prototype.del = function (auth, requestData, cb) {
    //...
};

module.exports = User;
```

### controller
Controller is a unit class for a resource logic. Inner space of a resource.

```js
"use strict";
var inherits = require('util').inherits;
var Unit = require('units').Unit;

var User = function () {
    this.db = null;
};
inherits(User, Unit);

User.prototype.unitInit = function (units) {
    this.db = units.require('db');
};

//db table name and scheme
User.prototype.box = "users";
User.prototype.scheme = {
    indexes: ["email", "displayName"]
};

User.prototype.get = function(email, exclude, cb) {
    this.db.query({
            box: this.box,
            get: email
        }, [
            {exclude: exclude}
        ],
    cb);
};

User.prototype.create = function (userData, cb) { /*...*/ };
User.prototype.update = function (email, to, cb) { /*...*/ };
User.prototype.updatePassword = function (email, newPassword, cb) { /*...*/ };
User.prototype.remove = function (email, cb) { /*...*/ };

module.exports = User;

```

### roles
Deprecated for now, work in process

### untis
Resource units

```js
"use strict";
var UnitSet = require("units").UnitSet;

var Controller = require("./controller");
var Api = require("./api");
var request = require("./request");
var response = require("./response");

module.exports = function () {
    var units = new UnitSet();

    units.add("controller", new Controller());
    units.add("api", new Api());
    units.add("request", request);
    units.add("response", response);

    return units;
};
```
