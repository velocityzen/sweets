
#Sweet structure
```
resources/
    resource1/
    resource2/
    validators.js — all validators for all resources
tags/
    tag1.js
    tag2.js
units.js — all resources && tags units
index.js — export unit set
```

#Resource structure
```
request.js      - unit, requests validators
response.js     — unit, response validators, can be omitted
api.js          - unit, api requests handlers
controller.js   - unit, resource logic and db interaction
roles.js        - roles for api requests. can be omitted
scheme.js       — resource scheme
defaults.js     — default settings for resource.
```
