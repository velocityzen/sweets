'use strict';

module.exports = function(languages) {
  return function(req, res, next) {
    let cookies = req.cookies || {};
    let language;

    if (cookies.language) {
      language = cookies.language;
    } else {
      var acceptLanguage = req.get('accept-language');
      if (acceptLanguage) {
        for (var i = languages.length - 1; i >= 0; i--) {
          var rx = new RegExp(languages[i], 'i');
          if (acceptLanguage.match(rx)) {
            language = languages[i];
            break;
          }
        }
      }

      res.cookie('language', language || languages[0], { maxAge: 900000, httpOnly: false });
    }

    req.body.language = language || languages[0];
    next();
  }
};
