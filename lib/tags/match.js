"use strict";

var Match = function() {
	this.tags = ['match'];
};

Match.prototype.parse = function(parser, nodes) {
	var token = parser.nextToken();
	var args = parser.parseSignature(null, true);
	parser.advanceAfterBlockEnd(token.value);
	return new nodes.CallExtension(this, 'render', args);
};

Match.prototype.render = function(context, string, match, trueResult, falseResult) {
	if(string.match( new RegExp(match) )) {
		return trueResult === undefined ? true : trueResult;
	} else {
		return falseResult === undefined ? false : falseResult;
	}
};


module.exports = Match;
