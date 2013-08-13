"use strict";

var resultErrHandler = function(NoResultError, retName, cb) {

	if(typeof NoResultError !== 'function') {
		cb = retName;
		retName = NoResultError;
		NoResultError = undefined;
	} else if(typeof retName === 'function') {
		cb = retName;
		retName = undefined;
	}

	return function(err, result) {
		if(err) {
			cb(err);
		} else {
			if(!result && NoResultError) {
				cb(new NoResultError());
			} else {
				if(retName === undefined) {
					cb(null, result);
				} else {
					var ret = {};
					if(typeof retName === 'string') {
						ret[retName] = result;
					} else {
						ret = retName;
					}
					cb(null, ret);
				}
			}
		}
	};
};


module.exports = {
	resultErrHandler: resultErrHandler
};
