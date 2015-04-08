# Sweet resource

**If you don't know yet what is unit, read *[units chapter](http://link to chapt)* first.**

```
resourceName/
    request.js      - unit, requests validators
    response.js     — unit, response validators, can be omitted
    api.js          - unit, api requests handlers
    controller.js   - unit, resource logic and db interaction
    roles.js        - roles for api requests. can be omitted
    defaults.js     — default settings for resource.
```

### request and response
request and response validators generators. Is a simple object with *at least one* request method validator. Response validators are optional, but very useful for testing purposes.

For validators sweets uses most powerful [valid](https://github.com/dimsmol/valid) lib and [sweets-valid](https://github.com/swts/valid) extension.

**Sweets uses request methods to generate contract. If resource has request with only get and create generators, contract will have only this methods.**

```js
'use strict';
var v = require('sweets-valid').validators;

module.exports = {
    get: function(settings) {
        return v.opt({
            email: v.email,
        });
    },

    create: function(settings) {
        var roles = settings.roles,
            validator = {
                email: v.email,
                password: v.str
            };

        //if we have roles array in settings we need to add roles validator in create request
        if(roles) {
            var rolesValidator = v.oneOf.apply(null, roles);
            validator.roles = v.opt(rolesValidator);
        }

        return validator;
    }
};

```

### api
Api is a unit class for interaction with outer space. 

* **No db interaction here.** Api uses only controllers' methods.
* Return conforming http error codes if error is occurred. There is easy to use error handler from [apis-return](https://github.com/velocityzen/apis-return) module.

####Properties and methods:
`name` — name of the resource. Ex. `"user"`, `"blog/post"`. Resource api will be avalible under this name `"/api/1/user"` and `"api/1/blog/post"`.

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
    //on instance creation we don't have access 
    //to controlller or any other unit
    this.ctrl = undefined;
};
inherits(User, Unit);

//resource name. We will learn about it later.
User.prototype.name = 'user';

User.prototype.unitInit = function (units) {
    //This is the best way to get access to resource controller
    this.ctrl = units.require('controller');
};

User.prototype.get = function (auth, requestData, cb) {
    if(requestData) {
        //if we have request with email return user profile or 404 error
        this.ctrl.get(requestData.email, returnHandler("NotFound", "user", cb));
    } else if(!auth) {
        //if we have empty request and no auth identity return 403 error
        cb(new Forbidden());
    } else {
        //and final if we have empty request but have auth.identity we return authenticated user profile or 400 error if this user doesn't exist
        this.ctrl.get(auth.identity.email, returnHandler("BadRequest", "user", cb));
    }
};

User.prototype.create = function (auth, requestData, cb) {
    var self = this;

    this.ctrl.create(requestData, function(err, result) {
        if(err) {
            //Error code 2 means dublicate record (we already have user with this email registered)
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

Controller is a unit class for resource logic. Inner space of resource.

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

User.prototype.box = "users";
User.prototype.scheme = {
    options: {
        primaryKey: "id"
    },
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
Optional. Roles for api requests

```js
module.exports = {
    create: "editor",
    del: "editor"
};
```

### untis
Resource units

```js
"use strict";
var UnitSet = require("units").UnitSet;

var Controller = require("./controller");
var Api = require("./api");
var request = require("./request");
var response = require("./response");
var roles = require("./roles");

module.exports = function () {
    var units = new UnitSet();

    units.add("controller", new Controller());
    units.add("api", new Api());
    units.add("request", request);
    units.add("response", response);
    units.expose("roles", roles);

    return units;
};
```
